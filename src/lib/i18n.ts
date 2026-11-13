import { useStore } from './store';

/**
 * Immersion mode: the interface gradually switches from English to German.
 * tier 1 = navigation, tier 2 = headings, tier 3 = buttons & helper text.
 */
const S: Record<string, [string, string, 1 | 2 | 3]> = {
  home: ['Home', 'Start', 1],
  vocabulary: ['Vocabulary', 'Wortschatz', 1],
  reading: ['Reading', 'Lesen', 1],
  grammar: ['Grammar', 'Grammatik', 1],
  speaking: ['Speaking', 'Sprechen', 1],
  games: ['Games', 'Spiele', 1],
  progress: ['My Progress', 'Fortschritt', 1],
  wordOfDay: ['Word of the day', 'Wort des Tages', 2],
  todaysPlan: ['Today\'s plan', 'Heutiger Plan', 2],
  dailyGoal: ['Daily goal', 'Tagesziel', 2],
  streak: ['Streak', 'Serie', 2],
  wordsLearned: ['Words learned', 'Gelernte Wörter', 2],
  mastered: ['Mastered', 'Beherrscht', 2],
  toRevise: ['To revise', 'Wiederholen', 2],
  recommended: ['Recommended', 'Empfohlen', 2],
  quickSpeak: ['Quick speaking practice', 'Schnell sprechen üben', 2],
  notebook: ['My notebook', 'Mein Notizbuch', 2],
  mistakes: ['Mistake notebook', 'Fehlerheft', 2],
  examples: ['Examples', 'Beispiele', 2],
  usage: ['How it\'s used', 'Verwendung', 2],
  commonMistakes: ['Common mistakes', 'Häufige Fehler', 2],
  related: ['Related', 'Verwandte Wörter', 2],
  family: ['Word family', 'Wortfamilie', 2],
  questions: ['Comprehension', 'Verständnisfragen', 2],
  settings: ['Settings', 'Einstellungen', 2],
  achievements: ['Achievements', 'Erfolge', 2],
  start: ['Start', 'Los geht\'s', 3],
  check: ['Check', 'Prüfen', 3],
  next: ['Next', 'Weiter', 3],
  again: ['Again', 'Nochmal', 3],
  hard: ['Hard', 'Schwer', 3],
  good: ['Good', 'Gut', 3],
  easy: ['Easy', 'Leicht', 3],
  showAnswer: ['Show answer', 'Antwort zeigen', 3],
  save: ['Save', 'Speichern', 3],
  saved: ['Saved', 'Gespeichert', 3],
  listen: ['Listen', 'Anhören', 3],
  translation: ['Translation', 'Übersetzung', 3],
  search: ['Search words…', 'Wörter suchen…', 3],
  done: ['Done', 'Fertig', 3],
  playAgain: ['Play again', 'Nochmal spielen', 3],
};

export function useT() {
  const tier = useStore((s) => s.settings.immersion);
  return (key: keyof typeof S | string) => {
    const e = S[key as string];
    if (!e) return key as string;
    return tier >= e[2] ? e[1] : e[0];
  };
}
