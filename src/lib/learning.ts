import { GRAMMAR, TAG_LABEL } from '@/data/grammar';
import { READINGS } from '@/data/readings';
import { LEVELS, type Level, type Word } from '@/data/types';
import { VOCAB, WORDS_BY_ID } from '@/data/vocab';
import { isDifficult, isDue, isMastered, type CardState } from './srs';
import { streak, today, useStore } from './store';

const levelIdx = (l: Level) => LEVELS.indexOf(l);

/** Words available at the user's level: current level + all below, weighted to current. */
export function candidatePool(level: Level, topics: string[] = []) {
  const max = levelIdx(level);
  return VOCAB.filter((w) => levelIdx(w.level) <= max).sort((a, b) => {
    const topicBoost = (w: Word) => (topics.length && w.topics.some((t) => topics.includes(t)) ? -40 : 0);
    // lower levels first (foundations), then by frequency, then topic preference
    return levelIdx(a.level) * 100 + a.freq + topicBoost(a) - (levelIdx(b.level) * 100 + b.freq + topicBoost(b));
  });
}

/** Next unseen words in priority order */
export function nextNewWords(n: number, exclude: Set<string> = new Set()) {
  const { settings, cards } = useStore.getState();
  return candidatePool(settings.level, settings.topics)
    .filter((w) => !cards[w.id] && !exclude.has(w.id))
    .slice(0, n);
}

export function dueCards(now = Date.now()) {
  const { cards } = useStore.getState();
  return Object.values(cards)
    .filter((c) => isDue(c, now) && WORDS_BY_ID[c.wordId])
    .sort((a, b) => a.due - b.due);
}

/**
 * Builds the exposure queue used by notifications and Flow mode:
 * interleaves due reviews (difficult first) with new words — ~1 review per 2 new.
 */
export function buildQueue(n: number, now = Date.now()): { wordId: string; kind: 'new' | 'review' }[] {
  const { cards } = useStore.getState();
  const reviews = Object.values(cards)
    .filter((c) => WORDS_BY_ID[c.wordId])
    .sort((a, b) => Number(isDifficult(b)) - Number(isDifficult(a)) || a.due - b.due)
    .filter((c) => c.due <= now + 6 * 3600_000);
  const fresh = nextNewWords(n);
  const out: { wordId: string; kind: 'new' | 'review' }[] = [];
  let r = 0;
  let f = 0;
  while (out.length < n && (r < reviews.length || f < fresh.length)) {
    const wantReview = out.length % 3 === 2;
    if (wantReview && r < reviews.length) out.push({ wordId: reviews[r++].wordId, kind: 'review' });
    else if (f < fresh.length) out.push({ wordId: fresh[f++].id, kind: 'new' });
    else if (r < reviews.length) out.push({ wordId: reviews[r++].wordId, kind: 'review' });
  }
  return out;
}

/** Word of the day — deterministic per date and level */
export function wordOfTheDay(level: Level): Word {
  const pool = VOCAB.filter((w) => w.level === level);
  const seed = today().split('-').reduce((a, b) => a * 31 + Number(b), 7);
  return pool[seed % pool.length] ?? VOCAB[0];
}

export function dailyReading(level: Level) {
  const { generatedReadings } = useStore.getState();
  const fresh = generatedReadings.find((r) => r.level === level && r.date === today());
  if (fresh) return fresh;
  const pool = READINGS.filter((r) => r.level === level);
  const list = pool.length ? pool : READINGS;
  const seed = Math.floor(Date.now() / 86_400_000);
  return list[seed % list.length];
}

export function stats() {
  const s = useStore.getState();
  const cards = Object.values(s.cards);
  const now = Date.now();
  return {
    learned: cards.length,
    mastered: cards.filter(isMastered).length,
    revision: cards.filter((c) => isDue(c, now) || isDifficult(c)).length,
    due: cards.filter((c) => isDue(c, now)).length,
    difficult: cards.filter(isDifficult),
  };
}

/** Weakness score per grammar tag from exercises/games + word-level performance */
export function weaknesses() {
  const { skill, cards } = useStore.getState();
  const agg: Record<string, { ok: number; bad: number }> = {};
  for (const [tag, v] of Object.entries(skill)) agg[tag] = { ...v };
  for (const c of Object.values(cards)) {
    const w = WORDS_BY_ID[c.wordId];
    for (const t of w?.tags ?? []) {
      agg[t] = agg[t] ?? { ok: 0, bad: 0 };
      agg[t].ok += c.correct * 0.3;
      agg[t].bad += c.wrong * 0.3;
    }
  }
  return Object.entries(agg)
    .map(([tag, v]) => ({ tag, label: TAG_LABEL[tag] ?? tag, total: v.ok + v.bad, accuracy: v.ok / Math.max(1, v.ok + v.bad) }))
    .filter((x) => x.total >= 2)
    .sort((a, b) => a.accuracy - b.accuracy);
}

export interface PlanItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: string;
  done: boolean;
  reason?: string;
}

/** Personal daily plan: adapts to due cards, weak grammar tags and level */
export function dailyPlan(): PlanItem[] {
  const s = useStore.getState();
  const d = s.days[today()];
  const st = stats();
  const level = s.settings.level;
  const plan: PlanItem[] = [];

  if (st.due > 0)
    plan.push({ id: 'review', title: `Review ${st.due} due word${st.due === 1 ? '' : 's'}`, subtitle: 'Spaced repetition', href: '/review', icon: 'refresh', done: false, reason: 'These words are about to be forgotten.' });

  plan.push({
    id: 'new', title: `Learn ${s.settings.dailyGoalWords} new words`, subtitle: `${d?.newWords ?? 0}/${s.settings.dailyGoalWords} today · Word Flow`, href: '/flow', icon: 'flash',
    done: (d?.newWords ?? 0) >= s.settings.dailyGoalWords,
  });

  const weak = weaknesses().find((w) => w.accuracy < 0.7);
  const weakLesson = weak && GRAMMAR.find((g) => g.tag === weak.tag);
  const nextLesson =
    weakLesson ??
    GRAMMAR.find((g) => levelIdx(g.level) <= levelIdx(level) && !s.grammarDone[g.id]) ??
    GRAMMAR.find((g) => !s.grammarDone[g.id]);
  if (nextLesson)
    plan.push({
      id: 'grammar', title: nextLesson.title, subtitle: `Grammar · ${nextLesson.level}`, href: `/grammar/${nextLesson.id}`, icon: 'construct',
      done: (s.grammarDone[nextLesson.id]?.at ?? 0) > new Date().setHours(0, 0, 0, 0),
      reason: weakLesson ? `You score ${Math.round(weak!.accuracy * 100)}% on ${weak!.label} — let's strengthen it.` : undefined,
    });

  const r = dailyReading(level);
  plan.push({ id: 'reading', title: r.title, subtitle: `Daily reading · ${r.level}`, href: `/reading/${r.id}`, icon: 'book', done: !!s.readingDone[r.id] && (s.readingDone[r.id].at > new Date().setHours(0, 0, 0, 0)) });

  plan.push({ id: 'speak', title: 'Speak for 5 minutes', subtitle: 'AI conversation', href: '/speaking', icon: 'mic', done: (d?.speakingSec ?? 0) >= 300 });
  plan.push({ id: 'quiz', title: 'Daily Quiz', subtitle: 'Words & grammar from today', href: '/game/daily', icon: 'trophy', done: s.quizzes.some((q) => q.game === 'daily' && q.at > new Date().setHours(0, 0, 0, 0)) });
  return plan;
}

/** Rough CEFR progress estimate from vocabulary + grammar coverage at each level */
export function cefrProgress() {
  const s = useStore.getState();
  return LEVELS.map((lv) => {
    const words = VOCAB.filter((w) => w.level === lv);
    const known = words.filter((w) => s.cards[w.id]);
    const mastered = words.filter((w) => s.cards[w.id] && isMastered(s.cards[w.id] as CardState));
    const lessons = GRAMMAR.filter((g) => g.level === lv);
    const doneL = lessons.filter((g) => (s.grammarDone[g.id]?.score ?? 0) >= 0.6);
    const reads = READINGS.filter((r) => r.level === lv);
    const doneR = reads.filter((r) => s.readingDone[r.id]);
    const pct =
      0.35 * (known.length / Math.max(1, words.length)) +
      0.15 * (mastered.length / Math.max(1, words.length)) +
      0.35 * (doneL.length / Math.max(1, lessons.length)) +
      0.15 * (doneR.length / Math.max(1, reads.length));
    return { level: lv, pct: Math.min(1, pct) };
  });
}

export const ACHIEVEMENTS = [
  { id: 'first-word', title: 'Erstes Wort', desc: 'Learn your first word', icon: 'sparkles', test: () => stats().learned >= 1 },
  { id: 'words-50', title: 'Wortschatz 50', desc: 'Learn 50 words', icon: 'library', test: () => stats().learned >= 50 },
  { id: 'words-100', title: 'Wortschatz 100', desc: 'Learn 100 words', icon: 'library', test: () => stats().learned >= 100 },
  { id: 'mastered-10', title: 'Meister', desc: 'Master 10 words', icon: 'ribbon', test: () => stats().mastered >= 10 },
  { id: 'streak-3', title: 'Dranbleiben', desc: '3-day streak', icon: 'flame', test: () => streakNow() >= 3 },
  { id: 'streak-7', title: 'Eine Woche', desc: '7-day streak', icon: 'flame', test: () => streakNow() >= 7 },
  { id: 'grammar-5', title: 'Grammatikfan', desc: 'Finish 5 grammar lessons', icon: 'construct', test: () => Object.keys(useStore.getState().grammarDone).length >= 5 },
  { id: 'reader', title: 'Leseratte', desc: 'Read 5 passages', icon: 'book', test: () => Object.keys(useStore.getState().readingDone).length >= 5 },
  { id: 'speaker', title: 'Plaudertasche', desc: 'Speak for 30 minutes total', icon: 'mic', test: () => useStore.getState().speakingLog.reduce((a, b) => a + b.sec, 0) >= 1800 },
  { id: 'gamer', title: 'Spielkind', desc: 'Play 10 games', icon: 'game-controller', test: () => useStore.getState().quizzes.length >= 10 },
  { id: 'xp-1000', title: '1000 XP', desc: 'Earn 1000 XP', icon: 'star', test: () => useStore.getState().xp >= 1000 },
];

export const streakNow = () => streak(useStore.getState().days);

export function checkAchievements(): string[] {
  const s = useStore.getState();
  const fresh = ACHIEVEMENTS.filter((a) => !s.achievements.includes(a.id) && a.test());
  fresh.forEach((a) => s.unlock(a.id));
  return fresh.map((a) => a.title);
}

/** XP → player level */
export const playerLevel = (xp: number) => {
  const lvl = Math.floor(Math.sqrt(xp / 25)) + 1;
  const cur = 25 * (lvl - 1) ** 2;
  const next = 25 * lvl ** 2;
  return { lvl, progress: (xp - cur) / (next - cur), next };
};

export function shuffle<T>(a: T[]): T[] {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
