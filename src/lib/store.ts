import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Level, Reading } from '@/data/types';
import { newCard, review, type CardState, type Grade } from './srs';

export const today = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export interface DayStats {
  newWords: number;
  reviews: number;
  correct: number;
  xp: number;
  minutes: number;
  speakingSec: number;
  readings: number;
  grammar: number;
}

export interface Mistake {
  id: string;
  kind: 'grammar' | 'vocab' | 'speaking' | 'reading';
  tag?: string;
  wrong: string;
  right: string;
  explanation: string;
  at: number;
}

export interface Settings {
  level: Level;
  intervalMin: number; // 2,3,5,10,15,30
  notifications: boolean;
  quietStart: number; // hour 0-23
  quietEnd: number;
  theme: 'system' | 'light' | 'dark';
  immersion: 0 | 1 | 2 | 3;
  dailyGoalWords: number;
  dailyGoalMinutes: number;
  ttsRate: number;
  apiUrl: string;
  feedbackMode: 'end' | 'each';
  topics: string[];
  onboarded: boolean;
}

export interface ScheduledItem {
  wordId: string;
  at: number;
  kind: 'new' | 'review';
}

interface State {
  settings: Settings;
  cards: Record<string, CardState>;
  favorites: string[];
  mistakes: Mistake[];
  skill: Record<string, { ok: number; bad: number }>;
  grammarDone: Record<string, { score: number; at: number }>;
  readingDone: Record<string, { score: number; at: number }>;
  quizzes: { game: string; score: number; total: number; at: number }[];
  days: Record<string, DayStats>;
  xp: number;
  achievements: string[];
  scheduled: ScheduledItem[];
  generatedReadings: Reading[];
  speakingLog: { scenario: string; sec: number; at: number; turns: number }[];
  auth: { token?: string; email?: string };
  lastSync?: number;

  // actions
  set: (p: Partial<Settings>) => void;
  introduce: (wordId: string, at?: number) => void;
  grade: (wordId: string, g: Grade) => void;
  toggleFavorite: (wordId: string) => void;
  logMistake: (m: Omit<Mistake, 'id' | 'at'>) => void;
  removeMistake: (id: string) => void;
  recordSkill: (tag: string, ok: boolean) => void;
  addXp: (n: number) => void;
  bumpDay: (p: Partial<DayStats>) => void;
  finishGrammar: (id: string, score: number) => void;
  finishReading: (id: string, score: number) => void;
  finishQuiz: (game: string, score: number, total: number) => void;
  logSpeaking: (scenario: string, sec: number, turns: number) => void;
  setScheduled: (s: ScheduledItem[]) => void;
  absorbDeliveredNotifications: () => void;
  addGeneratedReading: (r: Reading) => void;
  setAuth: (a: State['auth']) => void;
  unlock: (id: string) => void;
  importState: (s: Partial<State>) => void;
  reset: () => void;
}

// Storage that never throws (sandboxed browsers may block localStorage) — falls back to memory
const mem: Record<string, string> = {};
const safeStorage = {
  getItem: async (k: string) => {
    try {
      return (await AsyncStorage.getItem(k)) ?? mem[k] ?? null;
    } catch {
      return mem[k] ?? null;
    }
  },
  setItem: async (k: string, v: string) => {
    mem[k] = v;
    try {
      await AsyncStorage.setItem(k, v);
    } catch {}
  },
  removeItem: async (k: string) => {
    delete mem[k];
    try {
      await AsyncStorage.removeItem(k);
    } catch {}
  },
};

const emptyDay = (): DayStats => ({ newWords: 0, reviews: 0, correct: 0, xp: 0, minutes: 0, speakingSec: 0, readings: 0, grammar: 0 });

const defaults = {
  settings: {
    level: 'A1' as Level,
    intervalMin: 3,
    notifications: false,
    quietStart: 22,
    quietEnd: 8,
    theme: 'system' as const,
    immersion: 0 as const,
    dailyGoalWords: 15,
    dailyGoalMinutes: 20,
    ttsRate: 0.9,
    apiUrl: '',
    feedbackMode: 'end' as const,
    topics: [],
    onboarded: false,
  },
  cards: {},
  favorites: [],
  mistakes: [],
  skill: {},
  grammarDone: {},
  readingDone: {},
  quizzes: [],
  days: {},
  xp: 0,
  achievements: [],
  scheduled: [],
  generatedReadings: [],
  speakingLog: [],
  auth: {},
};

export const useStore = create<State>()(
  persist(
    (set, get) => {
      const bump = (p: Partial<DayStats>) =>
        set((s) => {
          const k = today();
          const d = { ...(s.days[k] ?? emptyDay()) };
          for (const [key, v] of Object.entries(p)) (d as any)[key] += v as number;
          return { days: { ...s.days, [k]: d } };
        });

      return {
        ...defaults,
        set: (p) => set((s) => ({ settings: { ...s.settings, ...p } })),
        introduce: (wordId, at) => {
          if (get().cards[wordId]) return;
          set((s) => ({ cards: { ...s.cards, [wordId]: newCard(wordId, at ?? Date.now()) } }));
          bump({ newWords: 1, xp: 2 });
          set((s) => ({ xp: s.xp + 2 }));
        },
        grade: (wordId, g) => {
          const existing = get().cards[wordId] ?? newCard(wordId);
          const updated = review(existing, g);
          set((s) => ({ cards: { ...s.cards, [wordId]: updated }, xp: s.xp + (g === 0 ? 1 : 3) }));
          bump({ reviews: 1, correct: g > 0 ? 1 : 0, xp: g === 0 ? 1 : 3 });
        },
        toggleFavorite: (wordId) =>
          set((s) => ({
            favorites: s.favorites.includes(wordId) ? s.favorites.filter((f) => f !== wordId) : [wordId, ...s.favorites],
          })),
        logMistake: (m) =>
          set((s) => ({
            mistakes: [{ ...m, id: Math.random().toString(36).slice(2), at: Date.now() }, ...s.mistakes].slice(0, 300),
          })),
        removeMistake: (id) => set((s) => ({ mistakes: s.mistakes.filter((m) => m.id !== id) })),
        recordSkill: (tag, ok) =>
          set((s) => {
            const cur = s.skill[tag] ?? { ok: 0, bad: 0 };
            return { skill: { ...s.skill, [tag]: { ok: cur.ok + (ok ? 1 : 0), bad: cur.bad + (ok ? 0 : 1) } } };
          }),
        addXp: (n) => {
          set((s) => ({ xp: s.xp + n }));
          bump({ xp: n });
        },
        bumpDay: bump,
        finishGrammar: (id, score) => {
          set((s) => ({ grammarDone: { ...s.grammarDone, [id]: { score: Math.max(score, s.grammarDone[id]?.score ?? 0), at: Date.now() } } }));
          bump({ grammar: 1 });
        },
        finishReading: (id, score) => {
          set((s) => ({ readingDone: { ...s.readingDone, [id]: { score, at: Date.now() } } }));
          bump({ readings: 1 });
        },
        finishQuiz: (game, score, total) =>
          set((s) => ({ quizzes: [{ game, score, total, at: Date.now() }, ...s.quizzes].slice(0, 500) })),
        logSpeaking: (scenario, sec, turns) => {
          set((s) => ({ speakingLog: [{ scenario, sec, turns, at: Date.now() }, ...s.speakingLog].slice(0, 300) }));
          bump({ speakingSec: sec });
        },
        setScheduled: (scheduled) => set({ scheduled }),
        absorbDeliveredNotifications: () => {
          // Words whose notification time has passed count as "introduced" at that time
          const now = Date.now();
          const { scheduled, cards } = get();
          const past = scheduled.filter((x) => x.at <= now);
          if (!past.length) return;
          const newCards = { ...cards };
          let added = 0;
          for (const p of past) {
            if (!newCards[p.wordId]) {
              newCards[p.wordId] = newCard(p.wordId, p.at);
              added++;
            }
          }
          set({ cards: newCards, scheduled: scheduled.filter((x) => x.at > now) });
          if (added) bump({ newWords: added, xp: added * 2 });
        },
        addGeneratedReading: (r) => set((s) => ({ generatedReadings: [r, ...s.generatedReadings].slice(0, 60) })),
        setAuth: (auth) => set({ auth }),
        unlock: (id) => set((s) => (s.achievements.includes(id) ? s : { achievements: [...s.achievements, id] })),
        importState: (incoming) => set((s) => ({ ...s, ...incoming, settings: { ...s.settings, ...(incoming.settings ?? {}) } })),
        reset: () => set({ ...defaults }),
      };
    },
    {
      name: 'deutschflow-v1',
      storage: createJSONStorage(() => safeStorage),
      version: 1,
      merge: (persisted: any, current) => ({ ...current, ...persisted, settings: { ...current.settings, ...(persisted?.settings ?? {}) } }),
      partialize: (s) => {
        const { set: _a, introduce: _b, grade: _c, ...rest } = s as any;
        return Object.fromEntries(Object.entries(rest).filter(([, v]) => typeof v !== 'function')) as any;
      },
    },
  ),
);

/** Portion of the state that is synced to the backend */
export function syncPayload() {
  const s = useStore.getState();
  const { settings, cards, favorites, mistakes, skill, grammarDone, readingDone, quizzes, days, xp, achievements, speakingLog } = s;
  return { settings: { ...settings, apiUrl: undefined }, cards, favorites, mistakes, skill, grammarDone, readingDone, quizzes, days, xp, achievements, speakingLog };
}

export function streak(days: Record<string, DayStats>) {
  let n = 0;
  const d = new Date();
  const active = (k: string) => (days[k]?.xp ?? 0) > 0;
  if (!active(today(d))) d.setDate(d.getDate() - 1); // today not yet done doesn't break streak
  while (active(today(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
