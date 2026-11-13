import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, Chip, Row, Txt } from '@/components/ui';
import { LEVELS, type Level } from '@/data/types';
import { notificationsSupported, requestPermission, rescheduleVocabNotifications } from '@/lib/notifications';
import { useStore } from '@/lib/store';
import { useColors } from '@/lib/theme';

const LEVEL_DESC: Record<Level, string> = {
  A1: 'I\'m a complete beginner',
  A2: 'I know basic phrases',
  B1: 'I can handle everyday situations',
  B2: 'I can discuss most topics',
  C1: 'I want academic & professional fluency',
};
const TOPICS = ['daily', 'university', 'work', 'housing', 'health', 'government', 'travel', 'shopping', 'food', 'academic'];
const INTERVALS = [2, 3, 5, 10, 15, 30];

export default function Onboarding() {
  const c = useColors();
  const set = useStore((s) => s.set);
  const settings = useStore((s) => s.settings);
  const [step, setStep] = useState(0);

  const finish = async (withNotif: boolean) => {
    if (withNotif && notificationsSupported) {
      const ok = await requestPermission();
      set({ notifications: ok });
    }
    set({ onboarded: true });
    await rescheduleVocabNotifications().catch(() => {});
    router.replace('/');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ padding: 22, gap: 18, flexGrow: 1 }}>
        <Row gap={6}>{[0, 1, 2].map((i) => <View key={i} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i <= step ? c.primary : c.cardAlt }} />)}</Row>
        {step === 0 && (
          <Animated.View entering={FadeInRight} style={{ gap: 14 }}>
            <Txt variant="big">Willkommen! 🇩🇪</Txt>
            <Txt variant="sub">Your personal German teacher — all day, in small doses. What's your level?</Txt>
            {LEVELS.map((l) => (
              <Card key={l} onPress={() => set({ level: l })} style={{ borderWidth: 1.5, borderColor: settings.level === l ? c.primary : c.border }}>
                <Row><Txt variant="h2" style={{ width: 44 }}>{l}</Txt><Txt variant="sub">{LEVEL_DESC[l]}</Txt></Row>
              </Card>
            ))}
            <Button title="Weiter" onPress={() => setStep(1)} />
          </Animated.View>
        )}
        {step === 1 && (
          <Animated.View entering={FadeInRight} style={{ gap: 14 }}>
            <Txt variant="h1">What do you need German for?</Txt>
            <Txt variant="sub">We prioritise vocabulary from these areas.</Txt>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {TOPICS.map((t) => (
                <Chip key={t} label={t} active={settings.topics.includes(t)} onPress={() => set({ topics: settings.topics.includes(t) ? settings.topics.filter((x) => x !== t) : [...settings.topics, t] })} />
              ))}
            </View>
            <Txt variant="h3">New words per day</Txt>
            <Row gap={6}>{[10, 15, 25, 40].map((n) => <Chip key={n} label={String(n)} active={settings.dailyGoalWords === n} onPress={() => set({ dailyGoalWords: n })} />)}</Row>
            <Button title="Weiter" onPress={() => setStep(2)} />
          </Animated.View>
        )}
        {step === 2 && (
          <Animated.View entering={FadeInRight} style={{ gap: 14 }}>
            <Txt variant="h1">A new word every few minutes</Txt>
            <Txt variant="sub">Pick how often a word card should appear. In the app (Word Flow) the timing is exact; as phone notifications, your OS may delay them slightly to save battery.</Txt>
            <Row gap={6} style={{ flexWrap: 'wrap' }}>{INTERVALS.map((n) => <Chip key={n} label={`${n} min`} active={settings.intervalMin === n} onPress={() => set({ intervalMin: n })} />)}</Row>
            <Card tone="alt"><Txt variant="small">Quiet hours 22:00–08:00 are skipped automatically. Change anything later in Settings.</Txt></Card>
            {notificationsSupported ? <Button title="Enable word notifications" icon="notifications" onPress={() => finish(true)} /> : null}
            <Button title={notificationsSupported ? 'Maybe later' : 'Los geht\'s'} kind="secondary" onPress={() => finish(false)} />
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
