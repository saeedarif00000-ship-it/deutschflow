import * as Speech from 'expo-speech';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { useStore } from './store';

// ── Text-to-speech ───────────────────────────────────────────
let germanVoice: string | undefined;
let voiceChecked = false;

async function pickVoice() {
  if (voiceChecked) return germanVoice;
  voiceChecked = true;
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const de = voices.filter((v) => v.language?.toLowerCase().startsWith('de'));
    // prefer enhanced/premium quality voices
    const best = de.find((v) => String(v.quality).toLowerCase() === 'enhanced') ?? de[0];
    germanVoice = best?.identifier;
  } catch {}
  return germanVoice;
}

export async function speak(text: string, opts: { rate?: number; onDone?: () => void } = {}) {
  const voice = await pickVoice();
  Speech.stop();
  Speech.speak(text, {
    language: 'de-DE',
    voice,
    rate: opts.rate ?? useStore.getState().settings.ttsRate,
    onDone: opts.onDone,
    onStopped: opts.onDone,
    onError: opts.onDone,
  });
}

export const stopSpeaking = () => Speech.stop();

// ── Speech recognition ───────────────────────────────────────
// expo-speech-recognition requires a development build (not Expo Go).
// We load it lazily and fall back to typed input when unavailable.
let SR: any = null;
try {
  SR = require('expo-speech-recognition');
} catch {
  SR = null;
}

export const speechRecognitionAvailable = () => {
  try {
    return !!SR?.ExpoSpeechRecognitionModule && (Platform.OS !== 'web' || SR.ExpoSpeechRecognitionModule.isRecognitionAvailable?.());
  } catch {
    return false;
  }
};

/**
 * Hook that records German speech. Waits for the user to finish (no interruptions):
 * the user taps stop, or the recogniser ends on silence.
 */
export function useGermanRecognizer() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const finalRef = useRef('');
  const subs = useRef<{ remove: () => void }[]>([]);

  useEffect(() => {
    const mod = SR?.ExpoSpeechRecognitionModule;
    if (!mod?.addListener) return;
    subs.current = [
      mod.addListener('start', () => setListening(true)),
      mod.addListener('end', () => setListening(false)),
      mod.addListener('result', (e: any) => {
        const text = e.results?.[0]?.transcript ?? '';
        if (e.isFinal) {
          finalRef.current = (finalRef.current + ' ' + text).trim();
          setTranscript(finalRef.current);
        } else setTranscript((finalRef.current + ' ' + text).trim());
      }),
      mod.addListener('error', (e: any) => {
        setError(e.message ?? e.error);
        setListening(false);
      }),
    ];
    return () => subs.current.forEach((s) => s.remove());
  }, []);

  const start = async () => {
    setError(null);
    finalRef.current = '';
    setTranscript('');
    const mod = SR?.ExpoSpeechRecognitionModule;
    if (!mod) {
      setError('Speech recognition needs a development build. Type your answer instead.');
      return false;
    }
    const perm = await mod.requestPermissionsAsync();
    if (!perm.granted) {
      setError('Microphone permission denied.');
      return false;
    }
    stopSpeaking();
    mod.start({ lang: 'de-DE', interimResults: true, continuous: true, addsPunctuation: true });
    return true;
  };

  const stop = () => {
    SR?.ExpoSpeechRecognitionModule?.stop?.();
    setListening(false);
  };

  return { listening, transcript, setTranscript, error, start, stop, available: !!SR?.ExpoSpeechRecognitionModule };
}

/** Normalise for comparison: lowercase, strip punctuation, unify umlaut spellings */
export function normalizeDe(s: string) {
  return s
    .toLowerCase()
    .replace(/ae/g, 'ä')
    .replace(/oe/g, 'ö')
    .replace(/ue/g, 'ü')
    .replace(/ss/g, 'ß')
    .replace(/[^a-zäöüß ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Levenshtein-based similarity 0..1 for pronunciation scoring */
export function similarity(a: string, b: string) {
  const x = normalizeDe(a);
  const y = normalizeDe(b);
  if (!x.length && !y.length) return 1;
  const dp = Array.from({ length: x.length + 1 }, (_, i) => [i, ...Array(y.length).fill(0)]);
  for (let j = 1; j <= y.length; j++) dp[0][j] = j;
  for (let i = 1; i <= x.length; i++)
    for (let j = 1; j <= y.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1));
  return 1 - dp[x.length][y.length] / Math.max(x.length, y.length);
}
