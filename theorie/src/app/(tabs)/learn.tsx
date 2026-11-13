import { router } from 'expo-router';
import { View } from 'react-native';

import { Card, Icon, Progress, Row, Screen, Txt } from '@/components/ui';
import { QUESTIONS, TOPICS } from '@/data/questions';
import { progressFor, useStore } from '@/lib/store';
import { useColors } from '@/lib/theme';

export default function Learn() {
  const c = useColors();
  useStore((s) => s.q);
  return (
    <Screen title="Lernen">
      <Txt variant="sub">{QUESTIONS.length} Übungsfragen in {TOPICS.length} Themen · Grundstoff & Zusatzstoff B</Txt>
      {TOPICS.map((t) => {
        const list = QUESTIONS.filter((q) => q.topic === t.id);
        const p = progressFor(list);
        return (
          <Card key={t.id} onPress={() => router.push(`/topic/${t.id}`)} style={{ gap: 8 }}>
            <Row>
              <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: c.cardAlt, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={t.icon} color={c.primary} size={19} />
              </View>
              <View style={{ flex: 1 }}>
                <Txt variant="h3">{t.de}</Txt>
                <Txt variant="small">{t.en} · {list.length} Fragen</Txt>
              </View>
              <Txt variant="small" color={p.pct === 1 ? c.success : c.sub}>{p.learned}/{p.total}</Txt>
            </Row>
            <Progress value={p.pct} height={5} color={p.pct === 1 ? c.success : c.primary} />
          </Card>
        );
      })}
    </Screen>
  );
}
