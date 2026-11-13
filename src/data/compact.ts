import type { Level, PartOfSpeech, Topic, Word } from './types';

/**
 * Compact vocabulary format — one word per line, fields separated by "|".
 *
 *   N|gender|word|plural|english|topics|ex1|tr1|ex2|tr2            (noun; plural "-" = none, "=" = same as singular)
 *   V|infinitive|er-present|er-präteritum|perfekt|english|topics|ex1|tr1|ex2|tr2
 *   A|word|english|topics|ex1|tr1|ex2|tr2   (A adjective, D adverb, P preposition, K conjunction, X expression)
 *
 * topics: d daily · u university · w work · s shopping · t transport · h health
 *         g government · o housing · r travel · f food · a academic
 */
const TOPIC: Record<string, Topic> = { d: 'daily', u: 'university', w: 'work', s: 'shopping', t: 'transport', h: 'health', g: 'government', o: 'housing', r: 'travel', f: 'food', a: 'academic' };
const POS: Record<string, PartOfSpeech> = { N: 'noun', V: 'verb', A: 'adjective', D: 'adverb', P: 'preposition', K: 'conjunction', X: 'expression' };

const slug = (s: string) =>
  s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Approximate English-style respelling with the stressed syllable in capitals. */
export function autoPhonetic(word: string): string {
  const w = word.toLowerCase().replace(/^(sich|etw\.?|jdm\.?|jdn\.?)\s+/, '');
  return w.split(/\s+/).map(respell).join(' ');
}

const UNSTRESSED = ['be', 'ge', 'er', 'ver', 'zer', 'ent', 'emp', 'miss'];
const STRESSED_SUFFIX = /(ieren|ion|tät|erei|ei|ur|ik|ie|ell|ant|ent|ist|ität|ös|är)$/;

// [grapheme, respelling, isVowel] — longest first
const G: [string, string, boolean][] = [
  ['tsch', 'ch', false], ['sch', 'sh', false], ['chs', 'ks', false], ['ch', 'kh', false], ['ck', 'k', false], ['qu', 'kv', false],
  ['ph', 'f', false], ['th', 't', false], ['tz', 'ts', false], ['ng', 'ng', false], ['pf', 'pf', false], ['ss', 'ss', false],
  ['äu', 'oy', true], ['eu', 'oy', true], ['ei', 'eye', true], ['ai', 'eye', true], ['ey', 'eye', true], ['ie', 'ee', true], ['au', 'ow', true],
  ['aa', 'ah', true], ['ah', 'ah', true], ['ee', 'ay', true], ['eh', 'ay', true], ['oo', 'oh', true], ['oh', 'oh', true], ['uh', 'oo', true],
  ['äh', 'eh', true], ['öh', 'ö', true], ['üh', 'ü', true],
  ['a', 'a', true], ['e', 'e', true], ['i', 'i', true], ['o', 'o', true], ['u', 'oo', true], ['ä', 'e', true], ['ö', 'ö', true], ['ü', 'ü', true], ['y', 'ü', true],
  ['z', 'ts', false], ['w', 'v', false], ['v', 'f', false], ['j', 'y', false], ['ß', 'ss', false],
];

function respell(word: string): string {
  const w = word.replace(/[^a-zäöüß]/g, '');
  if (!w) return word;
  const chunks: { t: string; v: boolean }[] = [];
  let i = 0;
  while (i < w.length) {
    const g = G.find(([k]) => w.startsWith(k, i));
    if (g) {
      chunks.push({ t: g[1], v: g[2] });
      i += g[0].length;
    } else {
      chunks.push({ t: w[i], v: false });
      i++;
    }
  }
  // word-initial st/sp → sht/shp; s before vowel → z
  if (chunks[0]?.t === 's' && chunks[1] && !chunks[1].v && (chunks[1].t === 't' || chunks[1].t === 'p')) chunks[0].t = 'sh';
  chunks.forEach((c, k) => {
    if (c.t === 's' && chunks[k + 1]?.v && (k === 0 || !chunks[k - 1]?.v)) c.t = 'z';
  });
  // final devoicing
  const last = chunks[chunks.length - 1];
  if (last && !last.v) {
    if (last.t === 'g' && chunks[chunks.length - 2]?.t === 'i') last.t = 'kh';
    else last.t = ({ b: 'p', d: 't', g: 'k' } as Record<string, string>)[last.t] ?? last.t;
  }
  // syllabify
  const syl: string[] = [];
  let cur = '';
  let k = 0;
  while (k < chunks.length) {
    const c = chunks[k];
    cur += c.t;
    if (c.v) {
      // collect following consonants
      let j = k + 1;
      const cons: string[] = [];
      while (j < chunks.length && !chunks[j].v) cons.push(chunks[j++].t);
      if (j >= chunks.length) {
        cur += cons.join('');
        syl.push(cur);
        cur = '';
        k = j;
        continue;
      }
      if (cons.length <= 1) {
        syl.push(cur);
        cur = cons.join('');
      } else {
        syl.push(cur + cons[0]);
        cur = cons.slice(1).join('');
      }
      k = j;
      continue;
    }
    k++;
  }
  if (cur) syl.length ? (syl[syl.length - 1] += cur) : syl.push(cur);
  if (syl.length < 2) return syl.join('').toUpperCase();
  let stress = 0;
  if (UNSTRESSED.some((p) => w.startsWith(p) && w.length > p.length + 3)) stress = 1;
  if (STRESSED_SUFFIX.test(w)) stress = syl.length - 1;
  if (w.endsWith('ieren')) stress = syl.length - 2;
  return syl.map((x, n) => (n === stress ? x.toUpperCase() : x)).join('-');
}

const GLABEL = { der: 'masculine', die: 'feminine', das: 'neuter' } as const;
const SEP_PREFIX = /^(ab|an|auf|aus|bei|ein|fest|fort|weh|kaputt|her|hin|los|mit|nach|vor|weg|weiter|zu|zurück|zusammen|um|frei|teil|statt|kennen|spazieren|fern|statt)/;

export function parseCompact(src: string, level: Level, startFreq: number, existing: Set<string>): Word[] {
  const out: Word[] = [];
  let freq = startFreq;
  for (const raw of src.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const f = line.split('|').map((x) => x.trim());
    const kind = f[0];
    let w: Word | null = null;
    if (kind === 'N') {
      const [, g, de, pl, en, tp, e1, t1, e2, t2] = f;
      const gender = g as 'der' | 'die' | 'das';
      const plural = pl === '-' ? '— (no plural)' : pl === '=' ? `die ${de}` : `die ${pl}`;
      w = {
        id: slug(de), de, en, pos: 'noun', gender, plural, phonetic: '≈ ' + autoPhonetic(de), level, topics: tp.split(',').map((t) => TOPIC[t]).filter(Boolean), freq: freq++,
        examples: [[e1, t1], ...(e2 ? ([[e2, t2]] as [string, string][]) : [])],
        usage: `${gender} ${de} is ${GLABEL[gender]}. Plural: ${plural}.`,
        mistakes: `Always learn it with its article: ${gender} ${de}.${pl === '=' ? ' The plural looks the same — only the article changes (die).' : ''}`,
        tags: ['artikel'],
      };
    } else if (kind === 'V') {
      const [, inf, pres, praet, perf, en, tp, e1, t1, e2, t2] = f;
      const sein = perf.startsWith('ist ');
      const base = inf.replace(/^sich /, '');
      const separable = pres.includes(' ') && !pres.endsWith(' sich') && SEP_PREFIX.test(base);
      const tags = ['present', 'perfekt', ...(separable ? ['trennbar'] : []), ...(inf.startsWith('sich ') ? ['reflexiv'] : [])];
      w = {
        id: slug(inf), de: inf, en, pos: 'verb', verb: { present: pres, praeteritum: praet, perfekt: perf }, phonetic: '≈ ' + autoPhonetic(inf), level,
        topics: tp.split(',').map((t) => TOPIC[t]).filter(Boolean), freq: freq++,
        examples: [[e1, t1], ...(e2 ? ([[e2, t2]] as [string, string][]) : [])],
        usage: `Perfekt with "${sein ? 'sein' : 'haben'}": ${perf}.${separable ? ' Separable verb: the prefix goes to the end in main clauses.' : ''}${inf.startsWith('sich ') ? ' Reflexive: ich … mich, du … dich, er … sich.' : ''}`,
        mistakes: sein ? `Don't use "haben" in the Perfekt — it's "${perf}".` : separable ? `Split it in main clauses: "er ${pres}".` : `Präteritum: ${praet}; Perfekt: ${perf}.`,
        tags,
      };
    } else if (POS[kind]) {
      const [, de, en, tp, e1, t1, e2, t2] = f;
      w = {
        id: slug(de), de, en, pos: POS[kind], phonetic: '≈ ' + autoPhonetic(de), level, topics: tp.split(',').map((t) => TOPIC[t]).filter(Boolean), freq: freq++,
        examples: [[e1, t1], ...(e2 ? ([[e2, t2]] as [string, string][]) : [])],
        usage:
          kind === 'P' ? 'Check which case it takes in the examples.' : kind === 'K' ? 'Watch the word order after this conjunction (see examples).' : kind === 'A' ? 'Before a noun it takes an adjective ending (ein schnelles Auto).' : 'See the examples for typical use.',
        mistakes: '',
        tags: kind === 'A' ? ['adjendungen'] : kind === 'K' ? ['nebensatz'] : undefined,
      };
    }
    if (!w || existing.has(w.de.toLowerCase())) continue;
    let id = w.id;
    let n = 2;
    while (existing.has('#' + id)) id = `${w.id}-${n++}`;
    w.id = id;
    existing.add(w.de.toLowerCase());
    existing.add('#' + id);
    out.push(w);
  }
  return out;
}
