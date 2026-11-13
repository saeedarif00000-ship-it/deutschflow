import { router } from 'expo-router';
import { useMemo } from 'react';
import { View } from 'react-native';

import { Card, Icon, Pill, Progress, Row, Screen, Section, Txt } from '@/components/ui';
import { GRAMMAR } from '@/data/grammar';
import { LEVELS } from '@/data/types';
import { useT } from '@/lib/i18n';
import { weaknesses } from '@/lib/learning';
import { useStore } from '@/lib/store';
import { useColors } from '@/lib/theme';

export default function GrammarTab() {
  const c = useColors();
  const t = useT();
  const done = useStore((s) => s.grammarDone);
  const skill = useStore((s) => s.skill);
  const weak = useMemo(() => weaknesses().filter((w) => w.accuracy < 0.7), [skill]); // eslint-disable-line react-hooks/exhaustive-deps
  const weakTags = new Set(weak.map((w) => w.tag));

  return (
    <Screen title={t('grammar')} headerRight={<Txt variant="small">{Object.keys(done).length}/{GRAMMAR.length} done</Txt>}>
      {weak.length ? (
        <Card style={{ gap: 6, borderLeftWidth: 4, borderLeftColor: c.accent }}>
          <Txt variant="h3">Your AI teacher suggests</Txt>
          <Txt variant="sub">You're struggling with {weak.slice(0, 2).map((w) => `${w.label} (${Math.round(w.accuracy * 100)}%)`).join(' and ')}. Extra practice is now prioritised in your plan.</Txt>
        </Card>
      ) : null}
      {LEVELS.map((lv) => {
        const lessons = GRAMMAR.filter((g) => g.level === lv);
        if (!lessons.length) return null;
        return (
          <Section key={lv} title={lv}>
            {lessons.map((g) => {
              const d = done[g.id];
              return (
                <Card key={g.id} onPress={() => router.push(`/grammar/${g.id}`)} style={{ gap: 8 }}>
                  <Row>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Row gap={6}>
                        <Txt variant="h3">{g.title}</Txt>
                        {weakTags.has(g.tag) ? <Pill text="needs practice" color={c.accent} /> : null}
                      </Row>
                      <Txt variant="small">{g.titleDe} · {g.exercises.length} exercises</Txt>
                    </View>
                    {d ? <Icon name="checkmark-circle" color={d.score >= 0.6 ? c.success : c.accent} /> : <Icon name="chevron-forward" color={c.faint} size={16} />}
                  </Row>
                  {d ? <Progress value={d.score} color={d.score >= 0.6 ? c.success : c.accent} height={5} /> : null}
                </Card>
              );
            })}
          </Section>
        );
      })}
    </Screen>
  );
}
