import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import type { Question } from '@/data/questions';
import { isCorrect, useStore } from '@/lib/store';
import { useColors } from '@/lib/theme';
import { Scene } from './Scene';
import { SIGN_BY_ID, Sign } from './Sign';
import { AudioButton, Button, Card, Icon, IconButton, Input, Pill, Row, Txt, fail, success } from './ui';

const TOPIC_COLOR: Record<number, string> = { 2: '#6C8BD8', 3: '#3D43D8', 4: '#E28B18', 5: '#D6453D' };

export function QuestionImage({ q }: { q: Question }) {
  const c = useColors();
  if (!q.sign && !q.scene) return null;
  return (
    <View style={{ alignItems: 'center', backgroundColor: c.cardAlt, borderRadius: 14, padding: 12, gap: 6 }}>
      {q.sign ? <Sign id={q.sign} size={130} /> : null}
      {q.scene ? <Scene spec={q.scene} size={280} /> : null}
      {q.sign && SIGN_BY_ID[q.sign] ? <Txt variant="small">Zeichen {SIGN_BY_ID[q.sign].nr}</Txt> : null}
    </View>
  );
}

/**
 * Renders one question.
 * practice: the learner checks, gets feedback + explanation.
 * exam: answers are controlled by the parent, no feedback.
 */
export function QuestionView({
  q,
  mode,
  value,
  onChange,
  onChecked,
  reveal,
}: {
  q: Question;
  mode: 'practice' | 'exam' | 'review';
  value?: string;
  onChange?: (v: string) => void;
  onChecked?: (ok: boolean) => void;
  reveal?: boolean;
}) {
  const c = useColors();
  const lang = useStore((s) => s.settings.lang);
  const marked = useStore((s) => s.q[q.id]?.marked);
  const toggleMark = useStore((s) => s.toggleMark);
  const [local, setLocal] = useState('');
  const [checked, setChecked] = useState(false);
  const answer = mode === 'practice' ? local : value ?? '';
  const setAnswer = (v: string) => (mode === 'practice' ? setLocal(v) : onChange?.(v));
  const show = (mode === 'practice' && checked) || mode === 'review' || reveal;
  const picked = new Set(answer ? answer.split(',').map(Number) : []);

  const toggle = (i: number) => {
    if (show) return;
    const n = new Set(picked);
    n.has(i) ? n.delete(i) : n.add(i);
    setAnswer([...n].sort((a, b) => a - b).join(','));
  };

  const check = () => {
    const ok = isCorrect(q, answer);
    ok ? success() : fail();
    setChecked(true);
    useStore.getState().answer(q.id, ok);
    onChecked?.(ok);
  };

  const ok = isCorrect(q, answer);

  return (
    <View style={{ gap: 12 }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Row gap={6}>
          <Pill text={`${q.pts} Punkte`} color={TOPIC_COLOR[q.pts]} />
          <Pill text={q.cat === 'B' ? 'Zusatzstoff B' : 'Grundstoff'} color={c.sub} />
        </Row>
        <Row gap={6}>
          <AudioButton text={q.de} size={18} />
          <IconButton name={marked ? 'flag' : 'flag-outline'} color={marked ? c.accent : c.text} size={18} onPress={() => toggleMark(q.id)} />
        </Row>
      </Row>

      <QuestionImage q={q} />

      {lang !== 'en' ? <Txt variant="h3" style={{ fontSize: 17, lineHeight: 24 }}>{q.de}</Txt> : null}
      {lang !== 'de' ? <Txt variant={lang === 'en' ? 'h3' : 'sub'}>{q.en}</Txt> : null}

      {q.opts ? (
        <View style={{ gap: 8 }}>
          {q.opts.map((op, i) => {
            const sel = picked.has(i);
            const border = show ? (op.ok ? c.success : sel ? c.danger : c.border) : sel ? c.primary : c.border;
            return (
              <Pressable key={i} onPress={() => toggle(i)} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', padding: 13, borderRadius: 14, borderWidth: 1.5, borderColor: border, backgroundColor: show && op.ok ? c.success + '14' : sel ? c.primary + '10' : c.card }}>
                <View style={{ width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: sel ? c.primary : c.faint, backgroundColor: sel ? c.primary : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                  {sel ? <Icon name="checkmark" size={16} color={c.primaryText} /> : null}
                </View>
                <View style={{ flex: 1 }}>
                  {lang !== 'en' ? <Txt style={{ fontWeight: '600' }}>{op.de}</Txt> : null}
                  {lang !== 'de' ? <Txt variant={lang === 'en' ? 'body' : 'small'}>{op.en}</Txt> : null}
                </View>
                {show ? <Icon name={op.ok ? 'checkmark-circle' : 'close-circle-outline'} size={20} color={op.ok ? c.success : c.faint} /> : null}
              </Pressable>
            );
          })}
          <Txt variant="small">Mehrere Antworten können richtig sein · More than one answer can be correct</Txt>
        </View>
      ) : q.num ? (
        <Row>
          <Input value={answer} onChangeText={(t) => !show && setAnswer(t.replace(/[^0-9.,]/g, ''))} keyboardType="decimal-pad" placeholder="Zahl / number" style={{ flex: 1, fontSize: 20, fontWeight: '700' }} editable={!show} />
          <Txt variant="h3">{q.num.unit}</Txt>
        </Row>
      ) : null}

      {mode === 'practice' && !checked ? <Button title="Prüfen · Check" onPress={check} disabled={!answer} /> : null}

      {show ? (
        <Animated.View entering={FadeIn}>
          <Card style={{ gap: 6, borderLeftWidth: 4, borderLeftColor: ok ? c.success : c.danger }}>
            {mode !== 'review' || answer ? <Txt variant="h3" color={ok ? c.success : c.danger}>{ok ? 'Richtig! ✓' : `Falsch · ${q.pts} Fehlerpunkte`}</Txt> : null}
            {q.num ? <Txt>Richtige Antwort: <Txt style={{ fontWeight: '800' }}>{q.num.answer.toString().replace('.', ',')} {q.num.unit}</Txt></Txt> : null}
            <Txt variant="sub">{q.exp}</Txt>
          </Card>
        </Animated.View>
      ) : null}
    </View>
  );
}
