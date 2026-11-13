import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AudioButton, Button, Card, Chip, Empty, Row, StackScreen, Txt, fail, success } from '@/components/ui';
import { READINGS } from '@/data/readings';
import { glossFor } from '@/data/glossary';
import { displayWord, FORM_INDEX, WORDS_BY_ID } from '@/data/vocab';
import { checkAchievements } from '@/lib/learning';
import { speak, stopSpeaking } from '@/lib/speech';
import { useStore } from '@/lib/store';
import { useColors, type Colors } from '@/lib/theme';

const MODES = ['Read', 'Sentences', 'Word by word', 'Grammar', 'Questions'] as const;

const posColor = (c: Colors, pos?: string) =>
  ({ noun: c.der, verb: c.die, adj: c.das, adv: c.accent, prep: '#9B6BFF', conj: '#00A3B4', article: c.sub, pronoun: c.sub }[pos ?? ''] ?? c.text);

const tokenize = (s: string) => s.split(/(\s+)/).filter((x) => x.length);
const key = (tok: string) => tok.toLowerCase().replace(/[^a-zäöüß]/g, '');

export default function ReadingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useColors();
  const generated = useStore((s) => s.generatedReadings);
  const r = useMemo(() => [...generated, ...READINGS].find((x) => x.id === id), [id, generated]);
  const finish = useStore((s) => s.finishReading);
  const logMistake = useStore((s) => s.logMistake);
  const introduce = useStore((s) => s.introduce);
  const [mode, setMode] = useState<(typeof MODES)[number]>('Read');
  const [showEn, setShowEn] = useState(false);
  const [sel, setSel] = useState<{ tok: string; en?: string; pos?: string; wordId?: string } | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);

  if (!r) return <StackScreen title="Reading"><Empty icon="book" title="Passage not found" /></StackScreen>;

  const lookup = (tok: string) => {
    const k = key(tok);
    const g = glossFor(k, r.gloss);
    const wordId = FORM_INDEX[k];
    return { tok: tok.replace(/[„“".,!?:;()]/g, ''), en: g?.[0] ?? (wordId ? WORDS_BY_ID[wordId].en : undefined), pos: g?.[1] ?? (wordId ? WORDS_BY_ID[wordId].pos.replace('adjective', 'adj').replace('adverb', 'adv') : undefined), wordId };
  };

  const fullText = r.sentences.map((s) => s.de).join(' ');
  const score = r.questions.filter((q, i) => answers[i] === q.answer).length;

  const submit = () => {
    setChecked(true);
    const pct = score / r.questions.length;
    pct >= 0.6 ? success() : fail();
    r.questions.forEach((q, i) => {
      if (answers[i] !== q.answer) logMistake({ kind: 'reading', wrong: `${q.q} → ${q.options[answers[i]] ?? '—'}`, right: q.options[q.answer], explanation: `From "${r.title}"` });
    });
    r.vocab.forEach((v) => WORDS_BY_ID[v] && introduce(v));
    finish(r.id, pct);
    useStore.getState().addXp(10 + score * 5);
    checkAchievements();
  };

  return (
    <StackScreen title={r.level} right={<AudioButton text={fullText} rate={0.85} />}>
      <View style={{ gap: 4 }}>
        <Txt variant="h1">{r.title}</Txt>
        <Txt variant="sub">{r.titleEn}</Txt>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
        {MODES.map((m) => <Chip key={m} label={m} active={mode === m} onPress={() => setMode(m)} />)}
      </ScrollView>

      {mode === 'Read' && (
        <Animated.View entering={FadeIn} style={{ gap: 12 }}>
          <Card>
            <Text style={{ fontSize: 18, lineHeight: 30, color: c.text }}>
              {r.sentences.map((s, si) =>
                tokenize(s.de + ' ').map((tok, ti) =>
                  /^\s+$/.test(tok) ? (
                    tok
                  ) : (
                    <Text key={`${si}-${ti}`} onPress={() => setSel(lookup(tok))} style={sel?.tok === tok.replace(/[„“".,!?:;()]/g, '') ? { backgroundColor: c.primary + '33', borderRadius: 4 } : undefined}>
                      {tok}
                    </Text>
                  ),
                ),
              )}
            </Text>
          </Card>
          {sel ? (
            <Card tone="alt" style={{ gap: 6 }}>
              <Row style={{ justifyContent: 'space-between' }}>
                <Txt variant="h2">{sel.tok}</Txt>
                <AudioButton text={sel.tok} />
              </Row>
              <Txt>{sel.en ?? 'No gloss — tap "Ask" in Sentences for help.'}</Txt>
              {sel.pos ? <Txt variant="small" color={posColor(c, sel.pos)}>{sel.pos}</Txt> : null}
              {sel.wordId ? <Button small kind="secondary" title={`Open "${displayWord(WORDS_BY_ID[sel.wordId])}" card`} onPress={() => router.push(`/word/${sel.wordId}`)} /> : null}
            </Card>
          ) : (
            <Txt variant="small">Tap any word for its translation and grammar role.</Txt>
          )}
          <Button title={showEn ? 'Hide English translation' : 'Show English translation'} kind="ghost" onPress={() => setShowEn(!showEn)} />
          {showEn ? <Card><Txt variant="sub">{r.sentences.map((s) => s.en).join(' ')}</Txt></Card> : null}
          <Row>
            <Button title="Listen slowly" icon="play" kind="secondary" style={{ flex: 1 }} onPress={() => speak(fullText, { rate: 0.75 })} />
            <Button title="Stop" icon="stop" kind="ghost" onPress={stopSpeaking} />
          </Row>
        </Animated.View>
      )}

      {mode === 'Sentences' &&
        r.sentences.map((s, i) => (
          <Card key={i} style={{ gap: 6 }}>
            <Row style={{ alignItems: 'flex-start' }}>
              <Txt variant="small" style={{ width: 18 }}>{i + 1}</Txt>
              <Txt style={{ flex: 1, fontWeight: '600', fontSize: 16.5 }} selectable>{s.de}</Txt>
              <AudioButton text={s.de} size={18} />
            </Row>
            <Txt variant="sub" style={{ marginLeft: 28 }}>{s.en}</Txt>
            {s.note ? <Txt variant="small" color={c.accent} style={{ marginLeft: 28 }}>💡 {s.note}</Txt> : null}
          </Card>
        ))}

      {mode === 'Word by word' && (
        <View style={{ gap: 12 }}>
          <Row style={{ flexWrap: 'wrap' }} gap={8}>
            {['noun', 'verb', 'adj', 'adv', 'prep', 'conj', 'article'].map((p) => (
              <Txt key={p} variant="small" color={posColor(c, p)}>● {p}</Txt>
            ))}
          </Row>
          {r.sentences.map((s, i) => (
            <Card key={i} style={{ gap: 10 }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {s.de.split(/\s+/).map((tok, j) => {
                  const l = lookup(tok);
                  return (
                    <Pressable key={j} onPress={() => l.wordId && router.push(`/word/${l.wordId}`)} style={{ padding: 6, borderRadius: 8, backgroundColor: c.cardAlt, borderBottomWidth: 3, borderBottomColor: posColor(c, l.pos), minWidth: 44 }}>
                      <Text style={{ color: c.text, fontWeight: '700', fontSize: 15 }}>{l.tok}</Text>
                      <Text style={{ color: c.sub, fontSize: 11.5 }}>{l.en ?? '·'}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <Txt variant="sub">{s.en}</Txt>
            </Card>
          ))}
        </View>
      )}

      {mode === 'Grammar' && (
        <View style={{ gap: 10 }}>
          {r.grammar.map((g) => (
            <Card key={g.title} style={{ gap: 6 }}>
              <Txt variant="h3">{g.title}</Txt>
              <Txt>{g.text}</Txt>
            </Card>
          ))}
          <Txt variant="label">Key vocabulary</Txt>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {r.vocab.filter((v) => WORDS_BY_ID[v]).map((v) => (
              <Chip key={v} label={`${displayWord(WORDS_BY_ID[v])} · ${WORDS_BY_ID[v].en}`} onPress={() => router.push(`/word/${v}`)} />
            ))}
          </View>
        </View>
      )}

      {mode === 'Questions' && (
        <View style={{ gap: 12 }}>
          {r.questions.map((q, i) => (
            <Card key={i} style={{ gap: 8 }}>
              <Txt variant="h3">{i + 1}. {q.q}</Txt>
              {q.options.map((o, oi) => {
                const picked = answers[i] === oi;
                const right = checked && oi === q.answer;
                const wrong = checked && picked && oi !== q.answer;
                return (
                  <Pressable key={oi} disabled={checked} onPress={() => setAnswers({ ...answers, [i]: oi })} style={{ padding: 12, borderRadius: 12, borderWidth: 1.5, borderColor: right ? c.success : wrong ? c.danger : picked ? c.primary : c.border, backgroundColor: right ? c.success + '18' : wrong ? c.danger + '18' : 'transparent' }}>
                    <Txt>{o}</Txt>
                  </Pressable>
                );
              })}
            </Card>
          ))}
          {!checked ? (
            <Button title="Check answers" disabled={Object.keys(answers).length < r.questions.length} onPress={submit} />
          ) : (
            <Card tone="alt" style={{ alignItems: 'center', gap: 6 }}>
              <Txt variant="h2">{score}/{r.questions.length} correct</Txt>
              <Txt variant="sub">Passage completed · key words added to your reviews</Txt>
              <Button small kind="secondary" title="Try again" onPress={() => { setAnswers({}); setChecked(false); }} />
            </Card>
          )}
        </View>
      )}
    </StackScreen>
  );
}
