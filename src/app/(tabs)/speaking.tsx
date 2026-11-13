import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Card, Chip, Icon, Pill, Row, Screen, Section, Stat, Txt } from '@/components/ui';
import { SCENARIOS } from '@/data/scenarios';
import { LEVELS, type Level } from '@/data/types';
import { aiConfigured } from '@/lib/ai';
import { useT } from '@/lib/i18n';
import { speechRecognitionAvailable } from '@/lib/speech';
import { useStore } from '@/lib/store';
import { useColors } from '@/lib/theme';

const TOPICS = ['Alltag', 'Studium', 'Arbeit', 'Reisen', 'Essen', 'Wohnen', 'Hobbys', 'Nachrichten', 'Technologie', 'Kultur'];

export default function Speaking() {
  const c = useColors();
  const t = useT();
  const myLevel = useStore((s) => s.settings.level);
  const log = useStore((s) => s.speakingLog);
  const [level, setLevel] = useState<Level>(myLevel);
  const totalMin = Math.round(log.reduce((a, b) => a + b.sec, 0) / 60);

  return (
    <Screen title={t('speaking')}>
      <Row>
        <Stat label="Minutes spoken" value={totalMin} icon="mic" color={c.die} />
        <Stat label="Conversations" value={log.length} icon="chatbubbles" />
      </Row>
      {!aiConfigured() || !speechRecognitionAvailable() ? (
        <Card tone="alt" style={{ gap: 4 }}>
          <Txt variant="h3">Setup tips</Txt>
          {!aiConfigured() ? <Txt variant="sub">• Offline teacher active (scripted scenarios + rule-based corrections). Connect the AI server in Settings for free conversation and full grammar feedback.</Txt> : null}
          {!speechRecognitionAvailable() ? <Txt variant="sub">• Voice input needs a development build (not Expo Go). You can type your answers meanwhile.</Txt> : null}
        </Card>
      ) : null}

      <Section title="Level">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
          {LEVELS.map((l) => <Chip key={l} label={l} active={level === l} onPress={() => setLevel(l)} />)}
        </ScrollView>
      </Section>

      <Section title="Free conversation">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {TOPICS.map((tp) => (
            <Chip key={tp} label={tp} onPress={() => router.push({ pathname: '/chat', params: { level, topic: tp } })} />
          ))}
        </View>
      </Section>

      <Section title="Conversation simulator">
        {SCENARIOS.map((s) => (
          <Card key={s.id} onPress={() => router.push({ pathname: '/chat', params: { level: s.level > level ? s.level : level, scenario: s.id } })}>
            <Row>
              <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: c.cardAlt, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={s.icon} color={c.primary} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Txt variant="h3">{s.titleDe}</Txt>
                <Txt variant="small">{s.title} · {s.goal}</Txt>
              </View>
              <Pill text={s.level} />
            </Row>
          </Card>
        ))}
      </Section>

      <Section title="Pronunciation trainer">
        <Card onPress={() => router.push('/pronunciation')}>
          <Row>
            <Icon name="pulse" color={c.das} />
            <View style={{ flex: 1 }}>
              <Txt variant="h3">Train the tricky sounds</Txt>
              <Txt variant="small">ch, ü, ö, r, z … listen, repeat, get a similarity score</Txt>
            </View>
            <Icon name="chevron-forward" color={c.faint} size={16} />
          </Row>
        </Card>
      </Section>
    </Screen>
  );
}
