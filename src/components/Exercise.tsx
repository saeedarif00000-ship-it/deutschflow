import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import type { Exercise } from '@/data/types';
import { shuffle } from '@/lib/learning';
import { normalizeDe } from '@/lib/speech';
import { useColors } from '@/lib/theme';
import { Button, Card, Chip, Input, Row, Txt, fail, success } from './ui';

export function checkFill(input: string, answers: string[]) {
  const n = input.trim().toLowerCase();
  return answers.some((a) => a.toLowerCase() === n || normalizeDe(a) === normalizeDe(n));
}

export function checkOrder(input: string, answer: string) {
  const n = normalizeDe(input);
  return answer.split('|').some((a) => normalizeDe(a) === n);
}

/** Renders one exercise; calls onDone(correct, userAnswer) after the learner confirms */
export function ExerciseView({ ex, onDone, compact }: { ex: Exercise; onDone: (ok: boolean, given: string) => void; compact?: boolean }) {
  const c = useColors();
  const [picked, setPicked] = useState<number | null>(null);
  const [text, setText] = useState('');
  const [order, setOrder] = useState<string[]>([]);
  const [result, setResult] = useState<boolean | null>(null);
  const pool = useMemo(() => (ex.type === 'order' ? shuffle(ex.words.map((w, i) => `${w}§${i}`)) : []), [ex]);

  const confirm = () => {
    let ok = false;
    let given = '';
    if (ex.type === 'mc') { ok = picked === ex.answer; given = ex.options[picked ?? 0]; }
    if (ex.type === 'fill') { ok = checkFill(text, ex.answer); given = text; }
    if (ex.type === 'order') { given = order.map((o) => o.split('§')[0]).join(' '); ok = checkOrder(given, ex.answer); }
    ok ? success() : fail();
    setResult(ok);
    if (compact) onDone(ok, given);
  };

  const correctText = ex.type === 'mc' ? ex.options[ex.answer] : ex.type === 'fill' ? ex.answer[0] : ex.answer.split('|')[0];

  return (
    <View style={{ gap: 12 }}>
      {ex.type !== 'order' ? <Txt variant="h2">{ex.q}</Txt> : <Txt variant="h3">Build the sentence: <Txt variant="sub">{ex.en}</Txt></Txt>}

      {ex.type === 'mc' &&
        ex.options.map((o, i) => {
          const right = result !== null && i === ex.answer;
          const wrong = result !== null && picked === i && i !== ex.answer;
          return (
            <Pressable key={o} disabled={result !== null} onPress={() => setPicked(i)} style={{ padding: 14, borderRadius: 14, borderWidth: 1.5, borderColor: right ? c.success : wrong ? c.danger : picked === i ? c.primary : c.border, backgroundColor: right ? c.success + '18' : wrong ? c.danger + '18' : c.card }}>
              <Txt style={{ fontWeight: '600' }}>{o}</Txt>
            </Pressable>
          );
        })}

      {ex.type === 'fill' && (
        <>
          <Input value={text} onChangeText={setText} placeholder="Type your answer" editable={result === null} onSubmitEditing={() => text && result === null && confirm()} autoCorrect={false} />
          {ex.hint ? <Txt variant="small">Hint: {ex.hint}</Txt> : null}
          <Row gap={6}>
            {['ä', 'ö', 'ü', 'ß'].map((ch) => <Chip key={ch} label={ch} onPress={() => setText(text + ch)} />)}
          </Row>
        </>
      )}

      {ex.type === 'order' && (
        <>
          <Card tone="alt" style={{ minHeight: 60, flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {order.length ? order.map((o) => <Chip key={o} label={o.split('§')[0]} active onPress={() => result === null && setOrder(order.filter((x) => x !== o))} />) : <Txt variant="small">Tap words below in the right order</Txt>}
          </Card>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {pool.filter((p) => !order.includes(p)).map((p) => <Chip key={p} label={p.split('§')[0]} onPress={() => result === null && setOrder([...order, p])} />)}
          </View>
        </>
      )}

      {result === null ? (
        <Button title="Check" disabled={(ex.type === 'mc' && picked === null) || (ex.type === 'fill' && !text.trim()) || (ex.type === 'order' && order.length < ex.words.length)} onPress={confirm} />
      ) : (
        <Animated.View entering={FadeIn} style={{ gap: 10 }}>
          <Card style={{ gap: 4, borderLeftWidth: 4, borderLeftColor: result ? c.success : c.danger }}>
            <Txt variant="h3" color={result ? c.success : c.danger}>{result ? 'Richtig! ✓' : 'Not quite'}</Txt>
            {!result ? <Txt>Correct: <Txt style={{ fontWeight: '700' }}>{correctText}</Txt></Txt> : null}
            <Txt variant="sub">{ex.explain}</Txt>
          </Card>
          {!compact ? <Button title="Next" onPress={() => onDone(!!result, ex.type === 'mc' ? ex.options[picked ?? 0] : ex.type === 'fill' ? text : order.map((o) => o.split('§')[0]).join(' '))} /> : null}
        </Animated.View>
      )}
    </View>
  );
}
