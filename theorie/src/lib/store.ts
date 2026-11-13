import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { QUESTIONS, type Question } from '@/data/questions';

export interface QState { right: number; wrong: number; streak: number; last: number; marked?: boolean }
export interface ExamResult { id: string; at: number; errorPoints: number; passed: boolean; fivePtWrong: number; answers: Record<string, string>; questionIds: string[]; label: string; seconds: number }

interface Settings { theme: 'system' | 'light' | 'dark'; lang: 'de' | 'en' | 'both'; examDate?: string; ttsRate: number }

interface State {
  settings: Settings;
  q: Record<string, QState>;
  exams: ExamResult[];
  set: (p: Partial<Settings>) => void;
  answer: (id: string, ok: boolean) => void;
  toggleMark: (id: string) => void;
  saveExam: (r: ExamResult) => void;
  reset: () => void;
}

const mem: Record<string, string> = {};
const safeStorage = {
  getItem: async (k: string) => { try { return (await AsyncStorage.getItem(k)) ?? mem[k] ?? null; } catch { return mem[k] ?? null; } },
  setItem: async (k: string, v: string) => { mem[k] = v; try { await AsyncStorage.setItem(k, v); } catch {} },
  removeItem: async (k: string) => { delete mem[k]; try { await AsyncStorage.removeItem(k); } catch {} },
};

const defaults = { settings: { theme: 'system' as const, lang: 'both' as const, ttsRate: 0.95 }, q: {}, exams: [] };

export const useStore = create<State>()(
  persist(
    (set) => ({
      ...defaults,
      set: (p) => set((s) => ({ settings: { ...s.settings, ...p } })),
      answer: (id, ok) =>
        set((s) => {
          const c = s.q[id] ?? { right: 0, wrong: 0, streak: 0, last: 0 };
          return { q: { ...s.q, [id]: { ...c, right: c.right + (ok ? 1 : 0), wrong: c.wrong + (ok ? 0 : 1), streak: ok ? c.streak + 1 : 0, last: Date.now() } } };
        }),
      toggleMark: (id) => set((s) => { const c = s.q[id] ?? { right: 0, wrong: 0, streak: 0, last: 0 }; return { q: { ...s.q, [id]: { ...c, marked: !c.marked } } }; }),
      saveExam: (r) => set((s) => ({ exams: [r, ...s.exams].slice(0, 100) })),
      reset: () => set({ ...defaults }),
    }),
    {
      name: 'fahrflow-v1',
      storage: createJSONStorage(() => safeStorage),
      merge: (p: any, c) => ({ ...c, ...p, settings: { ...c.settings, ...(p?.settings ?? {}) } }),
      partialize: (s) => ({ settings: s.settings, q: s.q, exams: s.exams }) as any,
    },
  ),
);

/** A question counts as learned after being answered correctly twice in a row */
export const isLearned = (st?: QState) => !!st && st.streak >= 2;
export const isWeak = (st?: QState) => !!st && st.wrong > 0 && st.streak < 2;

export function progressFor(list: Question[]) {
  const q = useStore.getState().q;
  const learned = list.filter((x) => isLearned(q[x.id])).length;
  const seen = list.filter((x) => q[x.id]).length;
  return { learned, seen, total: list.length, pct: learned / Math.max(1, list.length) };
}

/** Is a given answer correct? answer = sorted option indexes "0,2" or the number typed */
export function isCorrect(question: Question, answer: string | undefined) {
  if (answer === undefined || answer === '') return false;
  if (question.num) return Math.abs(parseFloat(answer.replace(',', '.')) - question.num.answer) < 1e-9;
  const want = question.opts!.map((o, i) => (o.ok ? i : -1)).filter((i) => i >= 0).join(',');
  return answer === want;
}

// ── Exam builder ─────────────────────────────────────────────
function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
function shuffleWith<T>(a: T[], rnd: () => number) {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
}

/**
 * Exam like the real Class B first-time test: 20 basic (Grundstoff) + 10 Class B questions.
 * The real exam draws from the official pool; here we draw from this app's practice pool.
 * Our Class-B pool is smaller, so B slots not filled by B questions are topped up with basic ones.
 */
export function buildExam(seed?: number) {
  const rnd = seeded(seed ?? Math.floor(Math.random() * 1e9));
  const G = shuffleWith(QUESTIONS.filter((q) => q.cat === 'G'), rnd);
  const B = shuffleWith(QUESTIONS.filter((q) => q.cat === 'B'), rnd);
  const b = B.slice(0, 10);
  const g = G.slice(0, 30 - b.length);
  return [...g, ...b].map((q) => q.id);
}

export const PRACTICE_SHEETS = Array.from({ length: 8 }, (_, i) => ({ id: `bogen-${i + 1}`, label: `Übungsbogen ${i + 1}`, seed: 1000 + i * 7919 }));

export function scoreExam(ids: string[], answers: Record<string, string>) {
  let errorPoints = 0;
  let fivePtWrong = 0;
  let max = 0;
  for (const id of ids) {
    const q = QUESTIONS.find((x) => x.id === id)!;
    max += q.pts;
    if (!isCorrect(q, answers[id])) {
      errorPoints += q.pts;
      if (q.pts === 5) fivePtWrong++;
    }
  }
  return { errorPoints, fivePtWrong, max, passed: errorPoints <= 10 && fivePtWrong < 2 };
}
