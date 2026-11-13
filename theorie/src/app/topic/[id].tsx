import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeInRight, ZoomIn } from 'react-native-reanimated';

import { QuestionView } from '@/components/QuestionView';
import { Button, Card, Empty, Progress, Row, StackScreen, Txt } from '@/components/ui';
import { QUESTIONS, TOPICS } from '@/data/questions';
import { isLearned, isWeak, useStore } from '@/lib/store';

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

export default function TopicPractice() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const topic = TOPICS.find((t) => t.id === id);
  const title = topic?.de ?? ({ mixed: 'Gemischt', weak: 'Fehler wiederholen', marked: 'Markierte Fragen', images: 'Bildfragen' } as Record<string, string>)[id ?? ''] ?? 'Üben';

  const queue = useMemo(() => {
    const st = useStore.getState().q;
    let list = QUESTIONS;
    if (topic) list = QUESTIONS.filter((q) => q.topic === id);
    if (id === 'weak') list = QUESTIONS.filter((q) => isWeak(st[q.id]));
    if (id === 'marked') list = QUESTIONS.filter((q) => st[q.id]?.marked);
    if (id === 'images') list = QUESTIONS.filter((q) => q.sign || q.scene);
    // unsure / unseen first, learned last
    const rank = (q: (typeof QUESTIONS)[number]) => (isWeak(st[q.id]) ? 0 : !st[q.id] ? 1 : isLearned(st[q.id]) ? 3 : 2);
    const shuffled = shuffle(list).sort((a, b) => rank(a) - rank(b));
    return id === 'mixed' ? shuffled.slice(0, 20) : shuffled;
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const [i, setI] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [right, setRight] = useState(0);

  if (!queue.length)
    return <StackScreen title={title}><Empty icon="checkmark-done" title="Nichts zu üben" text={id === 'weak' ? 'Super – keine falsch beantworteten Fragen offen.' : 'Hier sind noch keine Fragen.'} /></StackScreen>;

  if (i >= queue.length)
    return (
      <StackScreen title={title}>
        <Animated.View entering={ZoomIn} style={{ alignItems: 'center', gap: 10, paddingTop: 20 }}>
          <Txt variant="big">{right / queue.length >= 0.8 ? '🏆' : '💪'}</Txt>
          <Txt variant="h1">{right}/{queue.length} richtig</Txt>
          <Row>
            <Button title="Nochmal" kind="secondary" onPress={() => { setI(0); setRight(0); setAnswered(false); }} />
            <Button title="Fertig" onPress={() => router.back()} />
          </Row>
        </Animated.View>
      </StackScreen>
    );

  const q = queue[i];
  return (
    <StackScreen title={`${title} · ${i + 1}/${queue.length}`}>
      <Progress value={i / queue.length} />
      <Animated.View key={q.id} entering={FadeInRight.duration(250)}>
        <Card>
          <QuestionView q={q} mode="practice" onChecked={(ok) => { setAnswered(true); if (ok) setRight((r) => r + 1); }} />
        </Card>
      </Animated.View>
      {answered ? <Button title={i + 1 < queue.length ? 'Nächste Frage →' : 'Ergebnis'} onPress={() => { setAnswered(false); setI(i + 1); }} /> : null}
      <View style={{ height: 20 }} />
    </StackScreen>
  );
}
