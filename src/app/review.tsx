import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import Animated, { FlipInEasyX, ZoomIn } from 'react-native-reanimated';

import { AudioButton, Button, Card, Empty, Progress, Row, StackScreen, Txt } from '@/components/ui';
import { GrammarFacts, WordHeader } from '@/components/WordCard';
import { displayWord, WORDS_BY_ID } from '@/data/vocab';
import { useT } from '@/lib/i18n';
import { checkAchievements, dueCards, shuffle, stats } from '@/lib/learning';
import { previewIntervals, type Grade } from '@/lib/srs';
import { useStore } from '@/lib/store';
import { genderColor, useColors } from '@/lib/theme';

export default function Review() {
  const c = useColors();
  const t = useT();
  const grade = useStore((s) => s.grade);
  const cards = useStore((s) => s.cards);
  const queue = useMemo(() => {
    const due = dueCards().map((x) => x.wordId);
    if (due.length) return due.slice(0, 30);
    // nothing due: practise difficult words
    return shuffle(stats().difficult.map((x) => x.wordId)).slice(0, 15);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const reverse = i % 3 === 2; // every third card: English → German

  if (!queue.length)
    return (
      <StackScreen title="Review">
        <Empty icon="checkmark-done" title="All caught up!" text="No words are due. Learn new words in Word Flow and they'll come back here at the right moment." action={<Button title="Open Word Flow" icon="flash" onPress={() => router.replace('/flow')} />} />
      </StackScreen>
    );

  if (i >= queue.length) {
    const ok = results.filter((r) => r > 0).length;
    checkAchievements();
    return (
      <StackScreen title="Review">
        <Animated.View entering={ZoomIn} style={{ alignItems: 'center', gap: 10, paddingTop: 30 }}>
          <Txt variant="big">🎉</Txt>
          <Txt variant="h1">Session complete</Txt>
          <Txt variant="sub">{ok}/{results.length} remembered · +{ok * 3 + (results.length - ok)} XP</Txt>
        </Animated.View>
        <Button title={t('done')} onPress={() => router.back()} />
      </StackScreen>
    );
  }

  const w = WORDS_BY_ID[queue[i]];
  const previews = previewIntervals(cards[w.id]);
  const onGrade = (g: Grade) => {
    grade(w.id, g);
    setResults((r) => [...r, g]);
    setShown(false);
    setI(i + 1);
  };

  return (
    <StackScreen title={`Review ${i + 1}/${queue.length}`}>
      <Progress value={i / queue.length} />
      <Animated.View key={w.id + shown} entering={FlipInEasyX.duration(350)}>
        <Card style={{ minHeight: 220, justifyContent: 'center', gap: 12 }}>
          {!shown ? (
            <View style={{ alignItems: 'center', gap: 10 }}>
              <Txt variant="label">{reverse ? 'Say it in German' : 'What does it mean?'}</Txt>
              {reverse ? (
                <Txt variant="big" style={{ textAlign: 'center' }}>{w.en}</Txt>
              ) : (
                <>
                  <Txt variant="big" style={{ textAlign: 'center' }}>
                    {w.pos === 'noun' ? <Txt variant="big" color={c.faint}>___ </Txt> : null}
                    {w.de}
                  </Txt>
                  {w.pos === 'noun' ? <Txt variant="small">Also recall the article and plural</Txt> : null}
                  <AudioButton text={w.de} />
                </>
              )}
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              <WordHeader w={w} />
              <GrammarFacts w={w} />
              <Txt variant="sub" style={{ fontStyle: 'italic' }}>„{w.examples[0][0]}“ — {w.examples[0][1]}</Txt>
            </View>
          )}
        </Card>
      </Animated.View>
      {!shown ? (
        <Button title={t('showAnswer')} onPress={() => setShown(true)} />
      ) : (
        <Row gap={8}>
          {(['again', 'hard', 'good', 'easy'] as const).map((k, g) => (
            <Button
              key={k}
              small
              title={`${t(k)}\n${previews[g]}`}
              kind={g === 0 ? 'danger' : g === 3 ? 'success' : g === 1 ? 'secondary' : 'primary'}
              onPress={() => onGrade(g as Grade)}
              style={{ flex: 1, flexDirection: 'column', gap: 2 }}
            />
          ))}
        </Row>
      )}
      <Txt variant="small" style={{ textAlign: 'center' }}>
        {shown ? `Article colour: ${w.gender ? displayWord(w) : '—'}` : 'Try to answer out loud before revealing.'}
      </Txt>
      {shown && w.gender ? <View style={{ height: 4, borderRadius: 2, backgroundColor: genderColor(c, w.gender) }} /> : null}
    </StackScreen>
  );
}
