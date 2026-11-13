import * as Speech from 'expo-speech';
import { useStore } from './store';

export function speak(text: string, opts: { rate?: number; onDone?: () => void; lang?: string } = {}) {
  Speech.stop();
  Speech.speak(text, { language: opts.lang ?? 'de-DE', rate: opts.rate ?? useStore.getState().settings.ttsRate, onDone: opts.onDone, onStopped: opts.onDone, onError: opts.onDone });
}
export const stopSpeaking = () => Speech.stop();
