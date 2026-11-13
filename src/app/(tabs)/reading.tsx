import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import { Button, Card, Chip, Icon, Pill, Row, Screen, Section, Txt } from '@/components/ui';
import { READINGS } from '@/data/readings';
import { LEVELS, type Level, type Reading } from '@/data/types';
import { aiConfigured, generateReading } from '@/lib/ai';
import { useT } from '@/lib/i18n';
import { dailyReading } from '@/lib/learning';
import { today, useStore } from '@/lib/store';
import { useColors } from '@/lib/theme';

const TOPICS = ['university', 'student life', 'jobs', 'relationships', 'travel', 'Germany', 'culture', 'technology', 'business', 'news', 'daily life'];

export default function ReadingTab() {
  const c = useColors();
  const t = useT();
  const myLevel = useStore((s) => s.settings.level);
  const done = useStore((s) => s.readingDone);
  const generated = useStore((s) => s.generatedReadings);
  const add = useStore((s) => s.addGeneratedReading);
  const [level, setLevel] = useState<Level>(myLevel);
  const [topic, setTopic] = useState(TOPICS[0]);
  const [busy, setBusy] = useState(false);
  const daily = dailyReading(myLevel);
  const all: Reading[] = [...generated, ...READINGS].filter((r) => r.level === level);

  const gen = async () => {
    if (!aiConfigured()) {
      Alert.alert('AI server not set', 'Add your DeutschFlow server URL in Settings to generate a fresh passage every day. Built-in passages rotate daily meanwhile.');
      return;
    }
    setBusy(true);
    const r = await generateReading(level, topic);
    setBusy(false);
    if (!r) return Alert.alert('Could not generate', 'Check your server connection and try again.');
    const withId = { ...r, id: `ai-${Date.now()}`, level, date: today() };
    add(withId);
    router.push(`/reading/${withId.id}`);
  };

  const Item = ({ r }: { r: Reading }) => (
    <Card onPress={() => router.push(`/reading/${r.id}`)} style={{ gap: 6 }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Row gap={6}>
          <Pill text={r.level} />
          <Pill text={r.topic} color={c.sub} />
          {r.aiGenerated ? <Pill text="AI" color={c.accent} /> : null}
        </Row>
        {done[r.id] ? <Icon name="checkmark-circle" color={c.success} size={20} /> : null}
      </Row>
      <Txt variant="h3">{r.title}</Txt>
      <Txt variant="small">{r.titleEn} · {r.sentences.length} sentences</Txt>
    </Card>
  );

  return (
    <Screen title={t('reading')}>
      <Section title="Today's passage">
        <Card tone="primary" onPress={() => router.push(`/reading/${daily.id}`)} style={{ gap: 8 }}>
          <Txt variant="label" color={c.primaryText}>{daily.level} · {daily.topic}</Txt>
          <Txt variant="h2" color={c.primaryText}>{daily.title}</Txt>
          <Txt color={c.primaryText} style={{ opacity: 0.85 }} numberOfLines={2}>{daily.sentences.map((s) => s.de).join(' ')}</Txt>
          <Row><Txt variant="h3" color={c.primaryText}>Read now →</Txt></Row>
        </Card>
      </Section>

      <Section title="Generate a new story">
        <Card style={{ gap: 10 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
            {TOPICS.map((x) => <Chip key={x} label={x} active={topic === x} onPress={() => setTopic(x)} />)}
          </ScrollView>
          <Button title={`Generate ${level} passage about "${topic}"`} icon="sparkles" loading={busy} onPress={gen} />
          {!aiConfigured() ? <Txt variant="small">Requires the AI server (Settings). Offline, the built-in library rotates daily.</Txt> : null}
        </Card>
      </Section>

      <Section title="Library">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
          {LEVELS.map((l) => <Chip key={l} label={l} active={level === l} onPress={() => setLevel(l)} />)}
        </ScrollView>
        <View style={{ gap: 10 }}>
          {all.length ? all.map((r) => <Item key={r.id} r={r} />) : <Txt variant="sub">No passages at this level yet — generate one above.</Txt>}
        </View>
      </Section>
    </Screen>
  );
}
