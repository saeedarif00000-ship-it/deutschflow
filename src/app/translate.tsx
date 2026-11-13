import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AudioButton, Button, Card, Chip, Input, Row, StackScreen, Txt } from '@/components/ui';
import { EN_INDEX, glossFor } from '@/data/glossary';
import { displayWord, VOCAB, WORDS_BY_ID } from '@/data/vocab';
import { aiConfigured, translateText } from '@/lib/ai';
import { speak } from '@/lib/speech';
import { useColors, type Colors } from '@/lib/theme';

const posColor = (c: Colors, pos?: string) =>
  ({ noun: c.der, verb: c.die, adj: c.das, adv: c.accent, prep: '#9B6BFF', conj: '#00A3B4', article: c.sub, pronoun: c.sub }[pos ?? ''] ?? c.faint);

/** Find a known sentence translation among the example sentences */
function exactSentence(text: string, from: 'de' | 'en') {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß ]/g, '').replace(/\s+/g, ' ').trim();
  const n = norm(text);
  if (n.split(' ').length < 2) return null;
  for (const w of VOCAB) for (const [de, en] of w.examples) if (norm(from === 'de' ? de : en) === n) return from === 'de' ? en : de;
  return null;
}

export default function Translate() {
  const c = useColors();
  const p = useLocalSearchParams<{ text?: string }>();
  const [from, setFrom] = useState<'de' | 'en'>('de');
  const [text, setText] = useState(p.text ?? '');
  const [ai, setAi] = useState<{ translation: string; notes?: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const tokens = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);
  const known = useMemo(() => (text.trim() ? exactSentence(text, from) : null), [text, from]);

  const enMatches = useMemo(() => {
    if (from !== 'en' || !text.trim()) return [];
    const q = text.trim().toLowerCase().replace(/^to /, '');
    const exact = EN_INDEX.filter((e) => e.en === q);
    const partial = EN_INDEX.filter((e) => e.en !== q && (e.en.startsWith(q) || e.en.split(' ').includes(q)));
    const ids = [...new Set([...exact, ...partial].map((e) => e.id))].slice(0, 12);
    return ids.map((id) => WORDS_BY_ID[id]);
  }, [text, from]);

  const run = async () => {
    setBusy(true);
    setAi(await translateText(text, from));
    setBusy(false);
  };

  return (
    <StackScreen title="Translator">
      <Row>
        <Chip label="Deutsch → English" active={from === 'de'} onPress={() => { setFrom('de'); setAi(null); }} />
        <Chip label="English → Deutsch" active={from === 'en'} onPress={() => { setFrom('en'); setAi(null); }} />
      </Row>
      <Input
        value={text}
        onChangeText={(t) => { setText(t); setAi(null); }}
        placeholder={from === 'de' ? 'Type or paste German text…' : 'Type an English word or sentence…'}
        multiline
        autoCapitalize="sentences"
        style={{ minHeight: 90, textAlignVertical: 'top' }}
      />
      <Row>
        <Button title={aiConfigured() ? 'Translate full sentence' : 'Full translation (AI server)'} icon="sparkles" style={{ flex: 1 }} loading={busy} disabled={!text.trim() || !aiConfigured()} onPress={run} />
        {from === 'de' && text.trim() ? <AudioButton text={text} /> : null}
      </Row>
      {!aiConfigured() ? <Txt variant="small">Offline: word-by-word meanings from the app's dictionary (1,300+ words). Connect the AI server in Settings for natural full-sentence translations.</Txt> : null}

      {ai ? (
        <Card style={{ gap: 6, borderLeftWidth: 4, borderLeftColor: c.success }}>
          <Txt variant="label">Translation</Txt>
          <Row style={{ alignItems: 'flex-start' }}>
            <Txt style={{ flex: 1, fontSize: 17, fontWeight: '600' }} selectable>{ai.translation}</Txt>
            {from === 'en' ? <AudioButton text={ai.translation} /> : null}
          </Row>
          {ai.notes ? <Txt variant="sub">💡 {ai.notes}</Txt> : null}
        </Card>
      ) : null}

      {known ? (
        <Card style={{ gap: 4, borderLeftWidth: 4, borderLeftColor: c.primary }}>
          <Txt variant="label">From the app's sentences</Txt>
          <Txt style={{ fontSize: 17, fontWeight: '600' }}>{known}</Txt>
        </Card>
      ) : null}

      {from === 'de' && tokens.length ? (
        <Card style={{ gap: 10 }}>
          <Txt variant="label">Word by word</Txt>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {tokens.map((tok, i) => {
              const g = glossFor(tok);
              const clean = tok.replace(/[^A-Za-zÄÖÜäöüß-]/g, '');
              const w = VOCAB.find((v) => v.de.toLowerCase() === clean.toLowerCase());
              return (
                <Pressable key={i} onPress={() => (w ? router.push(`/word/${w.id}`) : speak(clean))} style={{ padding: 6, borderRadius: 8, backgroundColor: c.cardAlt, borderBottomWidth: 3, borderBottomColor: posColor(c, g?.[1]), minWidth: 44 }}>
                  <Text style={{ color: c.text, fontWeight: '700', fontSize: 15 }}>{clean}</Text>
                  <Text style={{ color: g ? c.sub : c.faint, fontSize: 11.5 }}>{g?.[0] ?? '?'}</Text>
                </Pressable>
              );
            })}
          </View>
          <Txt variant="small">Tap a word to open its card (or hear it). Word-by-word glosses don't show grammar — use the full translation for meaning.</Txt>
        </Card>
      ) : null}

      {from === 'en' && enMatches.length ? (
        <View style={{ gap: 8 }}>
          <Txt variant="label">German words</Txt>
          {enMatches.map((w) => (
            <Card key={w.id} onPress={() => router.push(`/word/${w.id}`)}>
              <Row style={{ justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Txt variant="h3">{displayWord(w)}</Txt>
                  <Txt variant="small">{w.en} · {w.pos} · {w.level}</Txt>
                </View>
                <AudioButton text={displayWord(w)} />
              </Row>
            </Card>
          ))}
        </View>
      ) : from === 'en' && text.trim() && !ai ? (
        <Txt variant="sub">No single-word match. For whole sentences use the full translation.</Txt>
      ) : null}
    </StackScreen>
  );
}
