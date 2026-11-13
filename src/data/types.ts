export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
export const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'preposition'
  | 'conjunction'
  | 'interjection'
  | 'expression';

export type Topic =
  | 'daily'
  | 'university'
  | 'work'
  | 'shopping'
  | 'transport'
  | 'health'
  | 'government'
  | 'housing'
  | 'travel'
  | 'food'
  | 'academic';

export interface VerbForms {
  /** 3rd person singular present (er/sie/es) */
  present: string;
  /** 3rd person singular Präteritum */
  praeteritum: string;
  /** Perfekt with auxiliary, 3rd person singular */
  perfekt: string;
}

export interface Word {
  id: string;
  de: string;
  en: string;
  pos: PartOfSpeech;
  gender?: 'der' | 'die' | 'das';
  plural?: string;
  verb?: VerbForms;
  phonetic: string;
  level: Level;
  topics: Topic[];
  /** Approximate frequency rank (lower = more common) */
  freq: number;
  examples: [string, string][];
  usage: string;
  mistakes: string;
  related?: string[];
  synonyms?: string[];
  antonyms?: string[];
  family?: string[];
  /** Grammar tags this word exercises, used by the adaptive planner */
  tags?: string[];
}

export interface Question {
  q: string;
  options: string[];
  answer: number;
  explain?: string;
}

export interface ReadingSentence {
  de: string;
  en: string;
  note?: string;
}

export interface Reading {
  id: string;
  level: Level;
  title: string;
  titleEn: string;
  topic: Topic | 'culture' | 'technology' | 'relationships' | 'news';
  sentences: ReadingSentence[];
  /** word form (lowercase) -> [English, part of speech] */
  gloss: Record<string, [string, string]>;
  grammar: { title: string; text: string }[];
  vocab: string[];
  questions: Question[];
  aiGenerated?: boolean;
  date?: string;
}

export type Exercise =
  | { type: 'mc'; q: string; options: string[]; answer: number; explain: string }
  | { type: 'fill'; q: string; answer: string[]; hint?: string; explain: string }
  | { type: 'order'; words: string[]; answer: string; en: string; explain: string };

export interface GrammarLesson {
  id: string;
  title: string;
  titleDe: string;
  level: Level;
  tag: string;
  summary: string;
  sections: { h: string; text: string; examples?: [string, string][]; table?: string[][] }[];
  exercises: Exercise[];
}

export interface Scenario {
  id: string;
  title: string;
  titleDe: string;
  level: Level;
  icon: string;
  goal: string;
  role: string;
  /** Offline script: tutor lines in order, with suggested learner replies */
  script: { tutor: string; en: string; suggestions: string[] }[];
}

export interface Expression {
  de: string;
  en: string;
  register: 'colloquial' | 'neutral' | 'slang' | 'idiom';
  example: [string, string];
  why: string;
}
