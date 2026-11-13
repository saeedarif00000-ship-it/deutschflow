import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { QuestionView } from '@/components/QuestionView';
import { Button, Card, Chip, Empty, Icon, Row, StackScreen, Txt } from '@/components/ui';
import { Q_BY_ID } from '@/data/questions';
import { isCorrect, useStore } from '@/lib/store';
import { useColors } from '@/lib/theme';

export default function Result() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useColors();
  const r = useStore((s) => s.exams.find((e) => e.id === id));
  const [filter, setFilter] = useState<'wrong' | 'all'>('wrong');
  const [open, setOpen] = useState<string | null>(null);
  if (!r) return <StackScreen title="Ergebnis"><Empty icon="help" title="Nicht gefunden" /></StackScreen>;
  const list = r.questionIds.filter((qid) => filter === 'all' || !isCorrect(Q_BY_ID[qid], r.answers[qid]));
  const right = r.questionIds.filter((qid) => isCorrect(Q_BY_ID[qid], r.answers[qid])).length;

  return (
    <StackScreen title="Ergebnis">
      <Animated.View entering={ZoomIn}>
        <Card style={{ alignItems: 'center', gap: 6, borderTopWidth: 6, borderTopColor: r.passed ? c.success : c.danger }}>
          <Txt variant="big">{r.passed ? '🎉' : '😕'}</Txt>
          <Txt variant="h1" color={r.passed ? c.success : c.danger}>{r.passed ? 'Bestanden' : 'Nicht bestanden'}</Txt>
          <Txt variant="h3">{r.errorPoints} Fehlerpunkte · {right}/30 richtig</Txt>
          <Txt variant="small">{r.label} · {Math.floor(r.seconds / 60)} min {r.seconds % 60} s</Txt>
          {!r.passed && r.errorPoints <= 10 && r.fivePtWrong >= 2 ? <Txt variant="sub" color={c.danger}>Zwei 5-Punkte-Fragen falsch → nicht bestanden, obwohl ≤ 10 Fehlerpunkte.</Txt> : null}
        </Card>
      </Animated.View>
      <Row>
        <Chip label="Nur Fehler" active={filter === 'wrong'} onPress={() => setFilter('wrong')} />
        <Chip label="Alle Fragen" active={filter === 'all'} onPress={() => setFilter('all')} />
      </Row>
      {list.map((qid) => {
        const q = Q_BY_ID[qid];
        const ok = isCorrect(q, r.answers[qid]);
        return (
          <Card key={qid} onPress={() => setOpen(open === qid ? null : qid)} style={{ gap: 8 }}>
            <Row>
              <Icon name={ok ? 'checkmark-circle' : 'close-circle'} color={ok ? c.success : c.danger} size={20} />
              <Txt style={{ flex: 1, fontWeight: '600' }} numberOfLines={open === qid ? undefined : 2}>{q.de}</Txt>
              <Txt variant="small">{q.pts} P.</Txt>
            </Row>
            {open === qid ? <View style={{ marginTop: 6 }}><QuestionView q={q} mode="review" value={r.answers[qid]} /></View> : null}
          </Card>
        );
      })}
      <Row>
        <Button title="Fehler üben" kind="secondary" style={{ flex: 1 }} onPress={() => router.replace('/topic/weak')} />
        <Button title="Neue Prüfung" style={{ flex: 1 }} onPress={() => router.replace({ pathname: '/exam-run', params: { label: 'Prüfungssimulation' } })} />
      </Row>
    </StackScreen>
  );
}
