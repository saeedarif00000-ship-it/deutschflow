import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { AudioButton, Card, Chip, Pill, Row, StackScreen, Txt } from '@/components/ui';
import { EXPRESSIONS } from '@/data/scenarios';
import { useColors } from '@/lib/theme';

const REG = ['all', 'colloquial', 'slang', 'idiom', 'neutral'] as const;

export default function Expressions() {
  const c = useColors();
  const [f, setF] = useState<(typeof REG)[number]>('all');
  return (
    <StackScreen title="Everyday German">
      <Txt variant="sub">Slang, idioms and the expressions Germans actually use — with the story of why.</Txt>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
        {REG.map((r) => <Chip key={r} label={r} active={f === r} onPress={() => setF(r)} />)}
      </ScrollView>
      {EXPRESSIONS.filter((e) => f === 'all' || e.register === f).map((e) => (
        <Card key={e.de} style={{ gap: 8 }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Txt variant="h2">{e.de}</Txt>
              <Txt variant="sub">{e.en}</Txt>
            </View>
            <AudioButton text={e.de} />
          </Row>
          <Pill text={e.register} color={e.register === 'slang' ? c.die : e.register === 'idiom' ? c.accent : c.primary} />
          <Card tone="alt" style={{ gap: 2 }}>
            <Txt style={{ fontWeight: '600' }}>{e.example[0]}</Txt>
            <Txt variant="small">{e.example[1]}</Txt>
          </Card>
          <Txt variant="small">🧠 Why Germans say it: {e.why}</Txt>
        </Card>
      ))}
    </StackScreen>
  );
}
