import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

import { ExerciseView } from '@/components/Exercise';
import { AudioButton, Button, Card, Empty, Input, Pill, Progress, Row, StackScreen, Txt } from '@/components/ui';
import { GRAMMAR_BY_ID } from '@/data/grammar';
import { explain } from '@/lib/ai';
import { checkAchievements } from '@/lib/learning';
import { useStore } from '@/lib/store';
import { useColors } from '@/lib/theme';

export default function GrammarLesson() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const g = GRAMMAR_BY_ID[id ?? ''];
  const c = useColors();
  const { finishGrammar, recordSkill, logMistake, addXp } = useStore.getState();
  const [phase, setPhase] = useState<'learn' | 'practice' | 'done'>('learn');
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [q, setQ] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);

  if (!g) return <StackScreen title="Grammar"><Empty icon="construct" title="Lesson not found" /></StackScreen>;

  const onDone = (ok: boolean, given: string) => {
    const ex = g.exercises[i];
    recordSkill(g.tag, ok);
    if (!ok)
      logMistake({
        kind: 'grammar', tag: g.tag,
        wrong: ex.type === 'order' ? given : `${ex.type === 'mc' || ex.type === 'fill' ? ex.q : ''} → ${given}`,
        right: ex.type === 'mc' ? ex.options[ex.answer] : ex.type === 'fill' ? ex.answer[0] : ex.answer.split('|')[0],
        explanation: ex.explain,
      });
    const s = score + (ok ? 1 : 0);
    setScore(s);
    if (i + 1 >= g.exercises.length) {
      finishGrammar(g.id, s / g.exercises.length);
      addXp(15 + s * 5);
      checkAchievements();
      setPhase('done');
    } else setI(i + 1);
  };

  const ask = async () => {
    if (!q.trim()) return;
    setAsking(true);
    setAnswer(await explain(q, `Grammar lesson: ${g.title}. ${g.summary}`));
    setAsking(false);
  };

  return (
    <StackScreen title={g.titleDe}>
      <View style={{ gap: 6 }}>
        <Row gap={6}><Pill text={g.level} /><Pill text={g.tag} color={c.sub} /></Row>
        <Txt variant="h1">{g.title}</Txt>
        <Txt variant="sub">{g.summary}</Txt>
      </View>

      {phase === 'learn' && (
        <>
          {g.sections.map((s, si) => (
            <Animated.View key={s.h} entering={FadeInDown.delay(si * 60)}>
              <Card style={{ gap: 10 }}>
                <Txt variant="h3">{s.h}</Txt>
                <Txt>{s.text}</Txt>
                {s.table ? (
                  <View style={{ borderRadius: 10, overflow: 'hidden', borderWidth: 0.5, borderColor: c.border }}>
                    {s.table.map((row, ri) => (
                      <View key={ri} style={{ flexDirection: 'row', backgroundColor: ri === 0 ? c.cardAlt : ri % 2 ? c.card : c.bg }}>
                        {row.map((cell, ci) => (
                          <View key={ci} style={{ flex: 1, padding: 8 }}>
                            <Txt variant={ri === 0 || ci === 0 ? 'small' : 'body'} style={{ fontWeight: ri === 0 || ci === 0 ? '700' : '500', fontSize: 13.5 }}>{cell}</Txt>
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                ) : null}
                {s.examples?.map(([de, en]) => (
                  <Row key={de} style={{ alignItems: 'flex-start' }}>
                    <View style={{ flex: 1 }}>
                      <Txt style={{ fontWeight: '600' }}>{de}</Txt>
                      <Txt variant="sub">{en}</Txt>
                    </View>
                    <AudioButton text={de.split('(')[0]} size={18} />
                  </Row>
                ))}
              </Card>
            </Animated.View>
          ))}
          <Card tone="alt" style={{ gap: 8 }}>
            <Txt variant="h3">Ask your AI teacher</Txt>
            <Input placeholder="e.g. Why is it 'mit dem' and not 'mit den'?" value={q} onChangeText={setQ} />
            <Button small title="Ask" icon="sparkles" kind="secondary" loading={asking} onPress={ask} />
            {answer ? <Txt selectable>{answer}</Txt> : null}
          </Card>
          <Button title={`Practise · ${g.exercises.length} exercises`} icon="play" onPress={() => setPhase('practice')} />
        </>
      )}

      {phase === 'practice' && (
        <View style={{ gap: 14 }}>
          <Progress value={i / g.exercises.length} />
          <Card>
            <ExerciseView key={i} ex={g.exercises[i]} onDone={onDone} />
          </Card>
        </View>
      )}

      {phase === 'done' && (
        <Animated.View entering={ZoomIn} style={{ gap: 12, alignItems: 'center', paddingTop: 10 }}>
          <Txt variant="big">{score / g.exercises.length >= 0.6 ? '🏆' : '💪'}</Txt>
          <Txt variant="h1">{score}/{g.exercises.length}</Txt>
          <Txt variant="sub" style={{ textAlign: 'center' }}>
            {score / g.exercises.length >= 0.6 ? 'Lesson complete! Your mistakes were saved to the mistake notebook.' : 'Keep going — this topic is now prioritised in your daily plan.'}
          </Txt>
          <Row>
            <Button title="Retry" kind="secondary" onPress={() => { setI(0); setScore(0); setPhase('practice'); }} />
            <Button title="Grammar Battle" icon="flash" onPress={() => router.push({ pathname: '/game/[type]', params: { type: 'battle', tag: g.tag } })} />
          </Row>
        </Animated.View>
      )}
    </StackScreen>
  );
}
