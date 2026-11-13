import { SCENARIOS } from '@/data/scenarios';
import type { Level, Reading, Word } from '@/data/types';
import { VOCAB } from '@/data/vocab';
import { weaknesses } from './learning';
import { useStore } from './store';

export interface Correction {
  wrong: string;
  right: string;
  explanation: string;
  tag?: string;
}

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface TutorReply {
  reply: string;
  replyEn?: string;
  corrections: Correction[];
  natural?: string;
  suggestions?: string[];
  offline?: boolean;
}

const base = () => useStore.getState().settings.apiUrl.replace(/\/$/, '');
export const aiConfigured = () => !!base();

async function post<T>(path: string, body: unknown, timeoutMs = 30000): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const token = useStore.getState().auth.token;
    const res = await fetch(base() + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

/** Compact learner profile so the AI teacher "remembers" the user */
export function learnerProfile() {
  const s = useStore.getState();
  return {
    level: s.settings.level,
    knownWords: Object.keys(s.cards).slice(0, 300),
    weakTopics: weaknesses().slice(0, 5).map((w) => `${w.label} (${Math.round(w.accuracy * 100)}%)`),
    recentMistakes: s.mistakes.slice(0, 12).map((m) => `${m.wrong} → ${m.right}`),
    grammarDone: Object.keys(s.grammarDone),
  };
}

// ── Conversation ─────────────────────────────────────────────
export async function tutorChat(opts: { level: Level; scenarioId?: string; topic?: string; history: ChatTurn[] }): Promise<TutorReply> {
  const last = opts.history.filter((h) => h.role === 'user').slice(-1)[0]?.content ?? '';
  if (aiConfigured()) {
    try {
      const scenario = SCENARIOS.find((s) => s.id === opts.scenarioId);
      return await post<TutorReply>('/ai/chat', { ...opts, scenario, profile: learnerProfile() });
    } catch (e) {
      console.warn('AI chat failed, using offline tutor', e);
    }
  }
  return offlineChat(opts, last);
}

export async function correctText(text: string, level: Level): Promise<{ corrected: string; corrections: Correction[]; natural?: string; offline?: boolean }> {
  if (aiConfigured()) {
    try {
      return await post('/ai/correct', { text, level, profile: learnerProfile() });
    } catch {}
  }
  const corrections = offlineCheck(text);
  let corrected = text;
  for (const c of corrections) corrected = corrected.replace(c.wrong, c.right);
  return { corrected, corrections, offline: true };
}

export async function explain(question: string, context?: string): Promise<string> {
  if (aiConfigured()) {
    try {
      const r = await post<{ answer: string }>('/ai/explain', { question, context, profile: learnerProfile() });
      return r.answer;
    } catch {}
  }
  return 'The AI teacher is offline. Add your server URL in Settings → AI server to ask free-form questions. Meanwhile, check the grammar notes and usage tips on this screen.';
}

export async function translateText(text: string, from: 'de' | 'en'): Promise<{ translation: string; notes?: string } | null> {
  if (!aiConfigured()) return null;
  try {
    return await post('/ai/translate', { text, from, profile: learnerProfile() });
  } catch {
    return null;
  }
}

export async function generateReading(level: Level, topic: string): Promise<Reading | null> {
  if (!aiConfigured()) return null;
  try {
    const r = await post<Reading>('/ai/reading', { level, topic, profile: learnerProfile() }, 60000);
    return { ...r, aiGenerated: true };
  } catch (e) {
    console.warn(e);
    return null;
  }
}

export async function generateWords(level: Level, topic: string): Promise<Word[]> {
  if (!aiConfigured()) return [];
  try {
    return await post<Word[]>('/ai/words', { level, topic, exclude: VOCAB.map((w) => w.de) }, 60000);
  } catch {
    return [];
  }
}

// ── Offline tutor ────────────────────────────────────────────
const FINITE = new Set(
  'bin bist ist sind seid war waren habe hast hat haben habt hatte hatten kann kannst können muss musst müssen will willst wollen darf darfst dürfen soll sollst sollen möchte möchtest möchten werde wirst wird werden gehe gehst geht gehen komme kommst kommt kommen mache machst macht machen arbeite arbeitest arbeitet arbeiten wohne wohnst wohnt wohnen lerne lernst lernt lernen regnet fahre fährst fährt fahren brauche brauchst braucht brauchen'.split(' '),
);
const SEIN_PARTICIPLES = ['gegangen', 'gekommen', 'gefahren', 'aufgestanden', 'geblieben', 'gewesen', 'geflogen', 'gereist', 'umgestiegen', 'eingestiegen', 'ausgestiegen', 'gelaufen', 'geworden', 'passiert', 'gestorben'];
const PROFESSIONS = ['student', 'studentin', 'ingenieur', 'ingenieurin', 'lehrer', 'lehrerin', 'arzt', 'ärztin', 'werkstudent', 'werkstudentin', 'informatiker', 'informatikerin'];
const NOUNS = VOCAB.filter((w) => w.pos === 'noun');

export function offlineCheck(text: string): Correction[] {
  const out: Correction[] = [];
  const t = text.trim();

  // 1. Verb position in subordinate clauses
  const subRe = /\b(weil|dass|obwohl|wenn|ob|damit|als)\s+([^,.!?;]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = subRe.exec(t))) {
    const words = m[2].trim().split(/\s+/);
    if (words.length < 3) continue;
    const idx = words.findIndex((w, i) => i > 0 && i < words.length - 1 && FINITE.has(w.toLowerCase()));
    if (idx > 0) {
      const verb = words[idx];
      const fixed = [...words.slice(0, idx), ...words.slice(idx + 1), verb].join(' ');
      out.push({
        wrong: `${m[1]} ${words.join(' ')}`,
        right: `${m[1]} ${fixed}`,
        explanation: `After "${m[1].toLowerCase()}" the conjugated verb ("${verb}") goes to the end of the clause.`,
        tag: 'nebensatz',
      });
    }
  }

  // 2. Hunger/Durst haben
  const hd = t.match(/\b(ich bin|du bist|er ist|sie ist|wir sind)\s+(hunger|durst|angst)\b/i);
  if (hd) {
    const map: Record<string, string> = { 'ich bin': 'ich habe', 'du bist': 'du hast', 'er ist': 'er hat', 'sie ist': 'sie hat', 'wir sind': 'wir haben' };
    out.push({ wrong: hd[0], right: `${map[hd[1].toLowerCase()]} ${hd[2]}`, explanation: 'German uses "haben" with Hunger, Durst and Angst: "Ich habe Hunger."', tag: 'present' });
  }

  // 3. Perfekt with sein
  const pf = t.match(new RegExp(`\\b(habe|hast|hat|haben|habt)\\b([^.!?]*?)\\b(${SEIN_PARTICIPLES.join('|')})\\b`, 'i'));
  if (pf) {
    const map: Record<string, string> = { habe: 'bin', hast: 'bist', hat: 'ist', haben: 'sind', habt: 'seid' };
    out.push({ wrong: `${pf[1]}${pf[2]}${pf[3]}`, right: `${map[pf[1].toLowerCase()]}${pf[2]}${pf[3]}`, explanation: `"${pf[3]}" forms the Perfekt with "sein" (movement / change of state).`, tag: 'perfekt' });
  }

  // 4. Profession without article
  const pr = t.match(new RegExp(`\\b(bin|bist|ist|sind)\\s+(ein|eine)\\s+(${PROFESSIONS.join('|')})\\b`, 'i'));
  if (pr) out.push({ wrong: pr[0], right: `${pr[1]} ${pr[3][0].toUpperCase()}${pr[3].slice(1)}`, explanation: 'No article before professions or roles: "Ich bin Student."', tag: 'artikel' });

  // 5. Collocations / anglicisms
  const coll: [RegExp, string, string][] = [
    [/\beine entscheidung machen\b/i, 'eine Entscheidung treffen', 'The collocation is "eine Entscheidung treffen".'],
    [/\bin meiner meinung\b/i, 'meiner Meinung nach', 'Say "Meiner Meinung nach …" (not "in meiner Meinung").'],
    [/\bich bin (\d+) jahre\b(?! alt)/i, 'ich bin $1 Jahre alt', 'Age: "Ich bin 25 Jahre alt" — "alt" is needed.'],
    [/\bich vermisse dich nicht so viel\b/i, 'ich vermisse dich nicht so sehr', 'Use "sehr" (degree) rather than "viel" (quantity) with verbs.'],
  ];
  for (const [re, right, expl] of coll) {
    const mm = t.match(re);
    if (mm) out.push({ wrong: mm[0], right: mm[0].replace(re, right), explanation: expl });
  }

  // 6. Article + noun gender mismatches that are impossible in any case
  const tokens = t.split(/\s+/);
  for (let i = 0; i < tokens.length - 1; i++) {
    const art = tokens[i].toLowerCase();
    if (!['der', 'die', 'das', 'den', 'dem'].includes(art)) continue;
    const nounRaw = tokens[i + 1].replace(/[^A-Za-zÄÖÜäöüß]/g, '');
    const noun = NOUNS.find((n) => n.de.toLowerCase() === nounRaw.toLowerCase());
    if (!noun || !noun.gender) continue;
    const sameAsPlural = noun.plural?.replace(/^die /, '').toLowerCase() === noun.de.toLowerCase();
    const allowed: Record<string, string[]> = {
      der: ['der', 'den', 'dem', ...(sameAsPlural ? ['die'] : [])],
      die: ['die', 'der'],
      das: ['das', 'dem', ...(sameAsPlural ? ['die', 'der', 'den'] : [])],
    };
    if (!allowed[noun.gender].includes(art)) {
      out.push({
        wrong: `${tokens[i]} ${tokens[i + 1]}`,
        right: `${noun.gender} ${noun.de}`,
        explanation: `"${noun.de}" is ${noun.gender === 'der' ? 'masculine' : noun.gender === 'die' ? 'feminine' : 'neuter'} (${noun.gender} ${noun.de}). Check the case, too.`,
        tag: 'artikel',
      });
    }
  }

  // 7. Noun capitalisation
  for (const n of NOUNS) {
    const re = new RegExp(`\\s${n.de.toLowerCase()}(?![a-zäöüß])`);
    if (re.test(t) && n.de[0] !== n.de[0].toLowerCase()) {
      out.push({ wrong: n.de.toLowerCase(), right: n.de, explanation: 'All German nouns are capitalised.', tag: 'artikel' });
      break;
    }
  }
  return out;
}

const OPEN_QUESTIONS: Record<Level, string[]> = {
  A1: ['Wie heißt du?', 'Woher kommst du?', 'Wo wohnst du?', 'Was trinkst du gern?', 'Was machst du heute?', 'Hast du Geschwister?'],
  A2: ['Was hast du am Wochenende gemacht?', 'Wie kommst du zur Uni?', 'Was kochst du gern?', 'Wohin möchtest du reisen?', 'Wie sieht deine Wohnung aus?'],
  B1: ['Warum lernst du Deutsch?', 'Was gefällt dir an Deutschland – und was nicht?', 'Erzähl mir von deinem Studium.', 'Was würdest du in deiner Stadt verändern?'],
  B2: ['Welche Vor- und Nachteile hat das Homeoffice?', 'Wie stehst du zur Nachhaltigkeit im Alltag?', 'Sollte das Studium in Deutschland Gebühren kosten?'],
  C1: ['Inwiefern verändert künstliche Intelligenz unsere Arbeitswelt?', 'Welche Rolle spielt Sprache für Integration?', 'Wie lässt sich bezahlbarer Wohnraum schaffen?'],
};

function offlineChat(opts: { level: Level; scenarioId?: string; history: ChatTurn[] }, last: string): TutorReply {
  const corrections = last ? offlineCheck(last) : [];
  const turns = opts.history.filter((h) => h.role === 'assistant').length;
  const scenario = SCENARIOS.find((s) => s.id === opts.scenarioId);
  if (scenario) {
    const step = scenario.script[Math.min(turns, scenario.script.length - 1)];
    const finished = turns >= scenario.script.length;
    return {
      reply: finished ? 'Super gemacht! Das Gespräch ist zu Ende. Möchtest du es noch einmal versuchen?' : step.tutor,
      replyEn: finished ? 'Well done! The conversation is over. Would you like to try again?' : step.en,
      corrections,
      suggestions: finished ? [] : step.suggestions,
      offline: true,
    };
  }
  const qs = OPEN_QUESTIONS[opts.level];
  const ack = ['Interessant!', 'Ah, verstehe.', 'Schön!', 'Okay, danke.', 'Wirklich?'][turns % 5];
  const q = qs[turns % qs.length];
  return { reply: turns === 0 ? `Hallo! Lass uns ein bisschen sprechen. ${q}` : `${ack} ${q}`, corrections, offline: true };
}
