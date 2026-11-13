// DeutschFlow backend — zero-dependency Node 22+ server
// • Auth (email + password, scrypt hashes, HMAC-signed tokens)
// • Progress sync (SQLite via node:sqlite)
// • AI teacher proxy to the Anthropic Messages API (key never ships in the app)
import http from 'node:http';
import crypto from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

const PORT = Number(process.env.PORT ?? 8787);
const API_KEY = process.env.ANTHROPIC_API_KEY ?? '';
const MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-5-5';
const SECRET = process.env.TOKEN_SECRET ?? loadOrCreateSecret();
const DB_PATH = process.env.DB_PATH ?? path.resolve('data/deutschflow.db');

function loadOrCreateSecret() {
  const f = path.resolve('data/.secret');
  fs.mkdirSync(path.dirname(f), { recursive: true });
  if (fs.existsSync(f)) return fs.readFileSync(f, 'utf8');
  const s = crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(f, s, { mode: 0o600 });
  return s;
}

// ── Database ────────────────────────────────────────────────
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec(`
  CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, hash TEXT NOT NULL, salt TEXT NOT NULL, created INTEGER NOT NULL);
  CREATE TABLE IF NOT EXISTS progress (user_id INTEGER PRIMARY KEY REFERENCES users(id), data TEXT NOT NULL, updated INTEGER NOT NULL);
`);

// ── Auth helpers ────────────────────────────────────────────
const hashPw = (pw, salt) => crypto.scryptSync(pw, salt, 64).toString('hex');
const b64 = (s) => Buffer.from(s).toString('base64url');
function sign(payload) {
  const body = b64(JSON.stringify({ ...payload, exp: Date.now() + 1000 * 60 * 60 * 24 * 90 }));
  const sig = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
}
function verify(token) {
  const [body, sig] = String(token ?? '').split('.');
  if (!body || !sig) return null;
  const expected = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  const p = JSON.parse(Buffer.from(body, 'base64url').toString());
  return p.exp > Date.now() ? p : null;
}

// ── Tiny rate limiter (per IP, per minute) ──────────────────
const hits = new Map();
function limited(ip, max = 40) {
  const now = Date.now();
  const h = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  h.push(now);
  hits.set(ip, h);
  return h.length > max;
}

// ── Anthropic ───────────────────────────────────────────────
async function claude(system, messages, maxTokens = 1200) {
  if (!API_KEY) throw Object.assign(new Error('ANTHROPIC_API_KEY not configured on server'), { status: 503 });
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages }),
  });
  if (!res.ok) throw Object.assign(new Error(`Anthropic ${res.status}: ${await res.text()}`), { status: 502 });
  const j = await res.json();
  return j.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
}

function parseJson(text) {
  const m = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = (m ? m[1] : text).trim();
  const start = raw.search(/[[{]/);
  return JSON.parse(raw.slice(start));
}

const profileText = (p = {}) =>
  `Learner profile — CEFR level: ${p.level ?? 'A1'}. Weak areas: ${(p.weakTopics ?? []).join(', ') || 'none yet'}. ` +
  `Recent mistakes: ${(p.recentMistakes ?? []).join('; ') || 'none'}. Completed grammar: ${(p.grammarDone ?? []).join(', ') || 'none'}. ` +
  `Known words (sample): ${(p.knownWords ?? []).slice(0, 80).join(', ')}.`;

const TEACHER = `You are a patient, encouraging German teacher for an English-speaking learner.
Rules: speak German at the learner's CEFR level (A1: very short simple sentences; C1: natural, idiomatic, complex).
Never interrupt or lecture mid-conversation: reply naturally to what the learner said, then ask ONE follow-up question.
Corrections are collected separately and explained in English. Only correct real errors (grammar, gender, case, word order, wrong word); ignore missing punctuation/capitalisation from speech-to-text.
If the learner struggles with a topic in their profile, steer the conversation to practise it gently.`;

// ── Routes ──────────────────────────────────────────────────
const routes = {
  'GET /health': async () => ({ ok: true, ai: !!API_KEY, model: MODEL }),

  'POST /auth/register': async ({ body }) => {
    const email = String(body.email ?? '').trim().toLowerCase();
    const pw = String(body.password ?? '');
    if (!/^\S+@\S+\.\S+$/.test(email)) throw Object.assign(new Error('Invalid email'), { status: 400 });
    if (pw.length < 8) throw Object.assign(new Error('Password must be at least 8 characters'), { status: 400 });
    const salt = crypto.randomBytes(16).toString('hex');
    try {
      const r = db.prepare('INSERT INTO users (email, hash, salt, created) VALUES (?, ?, ?, ?)').run(email, hashPw(pw, salt), salt, Date.now());
      return { token: sign({ uid: Number(r.lastInsertRowid) }), email };
    } catch {
      throw Object.assign(new Error('Account already exists'), { status: 409 });
    }
  },

  'POST /auth/login': async ({ body }) => {
    const email = String(body.email ?? '').trim().toLowerCase();
    const u = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    const ok = u && crypto.timingSafeEqual(Buffer.from(hashPw(String(body.password ?? ''), u.salt), 'hex'), Buffer.from(u.hash, 'hex'));
    if (!ok) throw Object.assign(new Error('Wrong email or password'), { status: 401 });
    return { token: sign({ uid: u.id }), email };
  },

  'GET /sync': async ({ user }) => {
    const row = db.prepare('SELECT data, updated FROM progress WHERE user_id = ?').get(user.uid);
    return row ? { data: JSON.parse(row.data), updatedAt: row.updated } : { data: null };
  },

  'PUT /sync': async ({ user, body }) => {
    const data = JSON.stringify(body.data ?? {});
    if (data.length > 5_000_000) throw Object.assign(new Error('Payload too large'), { status: 413 });
    db.prepare('INSERT INTO progress (user_id, data, updated) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated = excluded.updated').run(user.uid, data, Date.now());
    return { ok: true };
  },

  'POST /ai/chat': async ({ body }) => {
    const { level = 'A1', scenario, topic, history = [], profile } = body;
    const setting = scenario
      ? `Role-play: you are ${scenario.role}. Scenario: ${scenario.titleDe} (${scenario.title}). The learner's goal: ${scenario.goal}. Stay in role. When the goal is reached, wrap up politely.`
      : `Free conversation${topic ? ` about "${topic}"` : ''}.`;
    const system = `${TEACHER}\n${setting}\n${profileText({ ...profile, level })}
Respond ONLY with JSON: {"reply": German reply, "replyEn": English translation of reply, "corrections": [{"wrong": exact learner fragment, "right": corrected fragment, "explanation": short English explanation, "tag": one of artikel|present|wortstellung|akkusativ|dativ|genitiv|modal|trennbar|perfekt|wechselpraep|nebensatz|adjendungen|relativsatz|passiv|konjunktiv2|konjunktiv1|vocab}], "natural": optional more natural German version of the learner's LAST message or null, "suggestions": [2 short possible learner replies in German at level ${level}]}.
Corrections refer only to the learner's LAST message. If history is empty, greet and open the conversation (corrections: []).`;
    const msgs = history.length ? history.map((h) => ({ role: h.role, content: h.content })) : [{ role: 'user', content: '(Start the conversation.)' }];
    if (msgs[0].role === 'assistant') msgs.unshift({ role: 'user', content: '(Start the conversation.)' });
    const out = parseJson(await claude(system, msgs, 900));
    return { reply: out.reply, replyEn: out.replyEn, corrections: out.corrections ?? [], natural: out.natural ?? undefined, suggestions: out.suggestions ?? [] };
  },

  'POST /ai/correct': async ({ body }) => {
    const system = `${TEACHER}\n${profileText(body.profile)}\nReturn ONLY JSON: {"corrected": full corrected text, "corrections": [{"wrong","right","explanation","tag"}], "natural": more idiomatic version}.`;
    return parseJson(await claude(system, [{ role: 'user', content: String(body.text ?? '') }], 900));
  },

  'POST /ai/explain': async ({ body }) => {
    const system = `${TEACHER}\n${profileText(body.profile)}\nAnswer in clear English with short German examples (with translations). Max 180 words. Plain text, no markdown headings.`;
    const answer = await claude(system, [{ role: 'user', content: `${body.question}\n\nContext: ${body.context ?? ''}` }], 700);
    return { answer };
  },

  'POST /ai/translate': async ({ body }) => {
    const from = body.from === 'en' ? 'English' : 'German';
    const to = body.from === 'en' ? 'German' : 'English';
    const system = `Translate the user's ${from} text into natural ${to}. Return ONLY JSON: {"translation": string, "notes": short English note on any tricky grammar, gender or idiom (or null)}.`;
    return parseJson(await claude(system, [{ role: 'user', content: String(body.text ?? '').slice(0, 4000) }], 1200));
  },

  'POST /ai/reading': async ({ body }) => {
    const { level = 'A1', topic = 'daily life' } = body;
    const len = { A1: '5–7 short', A2: '6–8', B1: '7–9', B2: '7–10 complex', C1: '6–9 long, academic' }[level];
    const system = `You write graded German reading passages for learners. Realistic, interesting, about everyday life in Germany. ${profileText(body.profile)}
Return ONLY JSON matching:
{"title": German title, "titleEn": English title, "topic": one word, "sentences": [{"de","en","note": optional short English grammar note}], "gloss": {lowercase word form exactly as in text (letters only): [English, pos]} — include EVERY word in the text; pos ∈ noun|verb|adj|adv|prep|conj|article|pronoun|number|particle|name,
"grammar": [{"title","text"}] (3 items explaining sentence structure and grammar used), "vocab": [] , "questions": [{"q": German question, "options": [3 German options], "answer": index}] (3–4 items)}`;
    const out = parseJson(await claude(system, [{ role: 'user', content: `Level ${level}. Topic: ${topic}. ${len} sentences.` }], 4000));
    return { ...out, level, vocab: out.vocab ?? [] };
  },

  'POST /ai/words': async ({ body }) => {
    const system = `Generate 10 high-frequency German vocabulary items for level ${body.level}, topic "${body.topic}". Exclude: ${(body.exclude ?? []).slice(0, 300).join(', ')}.
Return ONLY a JSON array of objects: {"id": ascii slug, "de", "en", "pos": noun|verb|adjective|adverb|preposition|conjunction|expression, "gender": der|die|das (nouns only), "plural": "die …" (nouns), "verb": {"present": er-form, "praeteritum": er-form, "perfekt": "hat/ist + Partizip"} (verbs), "phonetic": English-style respelling with STRESSED syllable in caps, "level", "topics": [..], "freq": 500, "examples": [[de, en],[de, en]], "usage", "mistakes", "synonyms": [], "antonyms": [], "family": []}. Be strictly accurate.`;
    return parseJson(await claude(system, [{ role: 'user', content: 'Generate.' }], 4000));
  },
};

const PUBLIC = new Set(['GET /health', 'POST /auth/register', 'POST /auth/login']);

http
  .createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    if (req.method === 'OPTIONS') return res.writeHead(204).end();
    const key = `${req.method} ${req.url.split('?')[0]}`;
    const send = (status, obj) => res.writeHead(status, { 'Content-Type': 'application/json' }).end(JSON.stringify(obj));
    const handler = routes[key];
    if (!handler) return send(404, { error: 'Not found' });
    const ip = req.socket.remoteAddress ?? '';
    if (limited(ip, key.startsWith('POST /ai') ? 30 : 60)) return send(429, { error: 'Too many requests' });
    try {
      let raw = '';
      for await (const chunk of req) {
        raw += chunk;
        if (raw.length > 6_000_000) throw Object.assign(new Error('Payload too large'), { status: 413 });
      }
      const body = raw ? JSON.parse(raw) : {};
      const user = verify((req.headers.authorization ?? '').replace(/^Bearer /, ''));
      const needsAuth = !PUBLIC.has(key) && (key.includes('/sync') || process.env.REQUIRE_AUTH_FOR_AI === '1');
      if (needsAuth && !user) return send(401, { error: 'Sign in required' });
      send(200, await handler({ body, user }));
    } catch (e) {
      console.error(key, e.message);
      send(e.status ?? 500, { error: e.message });
    }
  })
  .listen(PORT, () => console.log(`DeutschFlow server on :${PORT} · AI ${API_KEY ? `on (${MODEL})` : 'OFF — set ANTHROPIC_API_KEY'}`));
