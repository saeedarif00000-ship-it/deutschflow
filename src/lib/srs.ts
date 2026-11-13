/**
 * Spaced repetition — SM-2 variant with four grades.
 * 0 = Again (forgot), 1 = Hard, 2 = Good, 3 = Easy
 */
export type Grade = 0 | 1 | 2 | 3;

export interface CardState {
  wordId: string;
  ease: number; // 1.3 … 3.0
  interval: number; // days
  reps: number;
  lapses: number;
  due: number; // epoch ms
  introducedAt: number;
  lastReviewed?: number;
  correct: number;
  wrong: number;
}

const DAY = 86_400_000;
const MIN = 60_000;

export function newCard(wordId: string, now = Date.now()): CardState {
  // First review ~10 minutes after the word is introduced
  return { wordId, ease: 2.5, interval: 0, reps: 0, lapses: 0, due: now + 10 * MIN, introducedAt: now, correct: 0, wrong: 0 };
}

export function review(card: CardState, grade: Grade, now = Date.now()): CardState {
  const c = { ...card, lastReviewed: now };
  if (grade === 0) {
    c.lapses += 1;
    c.reps = 0;
    c.wrong += 1;
    c.ease = Math.max(1.3, c.ease - 0.2);
    c.interval = 0;
    c.due = now + 5 * MIN; // relearn soon, same session
    return c;
  }
  c.correct += 1;
  if (c.reps === 0) c.interval = grade === 3 ? 3 : grade === 2 ? 1 : 0.5;
  else if (c.reps === 1) c.interval = grade === 3 ? 7 : grade === 2 ? 3 : 1.5;
  else c.interval = c.interval * (grade === 1 ? 1.2 : grade === 2 ? c.ease : c.ease * 1.3);
  c.ease = Math.min(3, Math.max(1.3, c.ease + (grade === 1 ? -0.15 : grade === 3 ? 0.15 : 0)));
  c.reps += 1;
  c.interval = Math.min(c.interval, 365);
  c.due = now + c.interval * DAY;
  return c;
}

export const isDue = (c: CardState, now = Date.now()) => c.due <= now;
export const isMastered = (c: CardState) => c.interval >= 21;
export const isDifficult = (c: CardState) => c.lapses >= 2 || (c.wrong > c.correct && c.wrong > 0);
export const needsRevision = (c: CardState, now = Date.now()) => isDue(c, now) || isDifficult(c);

/** Retention estimate 0..1 using exponential forgetting curve */
export function retention(c: CardState, now = Date.now()) {
  if (!c.lastReviewed) return 0.5;
  const elapsed = (now - c.lastReviewed) / DAY;
  const stability = Math.max(0.3, c.interval || 0.3);
  return Math.exp(-elapsed / (stability * 1.5));
}

export function intervalLabel(days: number) {
  if (days < 1 / 24) return `${Math.max(1, Math.round(days * 1440))} min`;
  if (days < 1) return `${Math.round(days * 24)} h`;
  if (days < 30) return `${Math.round(days)} d`;
  return `${Math.round(days / 30)} mo`;
}

/** Preview the interval each grade would produce, for button labels */
export function previewIntervals(card: CardState | undefined, now = Date.now()) {
  const base = card ?? newCard('preview', now);
  return ([0, 1, 2, 3] as Grade[]).map((g) => {
    const r = review(base, g, now);
    return intervalLabel((r.due - now) / DAY);
  });
}
