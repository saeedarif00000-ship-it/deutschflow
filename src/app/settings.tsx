import { useState } from 'react';
import { Alert, Platform, ScrollView, Switch, View } from 'react-native';

import { Button, Card, Chip, Input, Row, Section, StackScreen, Txt } from '@/components/ui';
import { LEVELS } from '@/data/types';
import { notificationsSupported, requestPermission, rescheduleVocabNotifications, sendTestNotification } from '@/lib/notifications';
import { speak } from '@/lib/speech';
import { useStore } from '@/lib/store';
import { login, logout, pullProgress, pushProgress, register } from '@/lib/sync';
import { useColors } from '@/lib/theme';

const INTERVALS = [2, 3, 5, 10, 15, 30];
const TOPICS = ['daily', 'university', 'work', 'shopping', 'transport', 'health', 'government', 'housing', 'travel', 'food', 'academic'];

function Line({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <Row style={{ justifyContent: 'space-between' }}>
      <View style={{ flex: 1 }}>
        <Txt>{label}</Txt>
        {sub ? <Txt variant="small">{sub}</Txt> : null}
      </View>
      {children}
    </Row>
  );
}

function Stepper({ value, onChange, min, max, step = 1, fmt }: { value: number; onChange: (n: number) => void; min: number; max: number; step?: number; fmt?: (n: number) => string }) {
  return (
    <Row gap={6}>
      <Chip label="−" onPress={() => onChange(Math.max(min, +(value - step).toFixed(2)))} />
      <Txt variant="h3" style={{ minWidth: 44, textAlign: 'center' }}>{fmt ? fmt(value) : value}</Txt>
      <Chip label="+" onPress={() => onChange(Math.min(max, +(value + step).toFixed(2)))} />
    </Row>
  );
}

export default function Settings() {
  const c = useColors();
  const s = useStore((x) => x.settings);
  const set = useStore((x) => x.set);
  const auth = useStore((x) => x.auth);
  const scheduled = useStore((x) => x.scheduled);
  const lastSync = useStore((x) => x.lastSync);
  const [url, setUrl] = useState(s.apiUrl);
  const [email, setEmail] = useState(auth.email ?? '');
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  const apply = async (p: Partial<typeof s>) => {
    set(p);
    const n = await rescheduleVocabNotifications().catch(() => 0);
    return n;
  };

  const toggleNotif = async (on: boolean) => {
    if (on) {
      const ok = await requestPermission();
      if (!ok) return Alert.alert('Permission needed', 'Allow notifications for DeutschFlow in your system settings.');
    }
    const n = await apply({ notifications: on });
    if (on) Alert.alert('Vocabulary notifications on', `${n} word cards scheduled every ${s.intervalMin} min (quiet hours skipped). Opening the app tops up the queue.`);
  };

  const testServer = async () => {
    setBusy('server');
    try {
      const r = await fetch(url.replace(/\/$/, '') + '/health');
      const j = await r.json();
      set({ apiUrl: url.trim() });
      Alert.alert('Connected', j.ai ? `AI ready (${j.model})` : 'Server reachable, but ANTHROPIC_API_KEY is not set on the server.');
    } catch (e: any) {
      Alert.alert('Could not reach server', String(e?.message ?? e));
    }
    setBusy(null);
  };

  const doAuth = async (kind: 'login' | 'register') => {
    setBusy(kind);
    try {
      set({ apiUrl: url.trim() });
      await (kind === 'login' ? login(email.trim(), pw) : register(email.trim(), pw));
      setPw('');
    } catch (e: any) {
      Alert.alert('Account', String(e?.message ?? e));
    }
    setBusy(null);
  };

  return (
    <StackScreen title="Settings">
      <Section title="Learning">
        <Card style={{ gap: 14 }}>
          <View style={{ gap: 8 }}>
            <Txt>Your level</Txt>
            <Row gap={6}>{LEVELS.map((l) => <Chip key={l} label={l} active={s.level === l} onPress={() => apply({ level: l })} />)}</Row>
          </View>
          <Line label="New words per day"><Stepper value={s.dailyGoalWords} min={5} max={60} step={5} onChange={(n) => set({ dailyGoalWords: n })} /></Line>
          <Line label="Study minutes per day"><Stepper value={s.dailyGoalMinutes} min={5} max={120} step={5} onChange={(n) => set({ dailyGoalMinutes: n })} /></Line>
          <View style={{ gap: 8 }}>
            <Txt>Preferred topics</Txt>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {TOPICS.map((t) => (
                <Chip key={t} label={t} active={s.topics.includes(t)} onPress={() => set({ topics: s.topics.includes(t) ? s.topics.filter((x) => x !== t) : [...s.topics, t] })} />
              ))}
            </View>
          </View>
        </Card>
      </Section>

      <Section title="Vocabulary notifications">
        <Card style={{ gap: 14 }}>
          {notificationsSupported ? (
            <Line label="Send word cards" sub={s.notifications ? `${scheduled.length} scheduled` : 'Off'}>
              <Switch value={s.notifications} onValueChange={toggleNotif} trackColor={{ true: c.primary }} />
            </Line>
          ) : (
            <Txt variant="sub">Notifications are available in the iOS/Android app. Use Word Flow here.</Txt>
          )}
          <View style={{ gap: 8 }}>
            <Txt>Interval</Txt>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              {INTERVALS.map((n) => <Chip key={n} label={`${n} min`} active={s.intervalMin === n} onPress={() => apply({ intervalMin: n })} />)}
            </ScrollView>
          </View>
          <Line label="Quiet hours start"><Stepper value={s.quietStart} min={0} max={23} fmt={(n) => `${n}:00`} onChange={(n) => apply({ quietStart: n })} /></Line>
          <Line label="Quiet hours end"><Stepper value={s.quietEnd} min={0} max={23} fmt={(n) => `${n}:00`} onChange={(n) => apply({ quietEnd: n })} /></Line>
          <Txt variant="small">
            {Platform.OS === 'ios'
              ? 'iOS allows up to 64 pending notifications, so ~60 cards are queued ahead and refilled each time you open the app.'
              : 'Android may delay notifications in battery-saving mode. Exempt DeutschFlow from battery optimisation for the most reliable timing.'}{' '}
            For exact timing while studying, use Word Flow.
          </Txt>
          {notificationsSupported ? <Button small kind="secondary" title="Send a test notification" onPress={sendTestNotification} /> : null}
        </Card>
      </Section>

      <Section title="Appearance & immersion">
        <Card style={{ gap: 14 }}>
          <View style={{ gap: 8 }}>
            <Txt>Theme</Txt>
            <Row gap={6}>{(['system', 'light', 'dark'] as const).map((t) => <Chip key={t} label={t} active={s.theme === t} onPress={() => set({ theme: t })} />)}</Row>
          </View>
          <View style={{ gap: 8 }}>
            <Txt>German immersion mode</Txt>
            <Txt variant="small">Gradually switch the interface to German: 1 = navigation, 2 = headings, 3 = buttons.</Txt>
            <Row gap={6}>{([0, 1, 2, 3] as const).map((n) => <Chip key={n} label={n === 0 ? 'Off' : `Level ${n}`} active={s.immersion === n} onPress={() => set({ immersion: n })} />)}</Row>
          </View>
          <Line label="Speech rate"><Stepper value={s.ttsRate} min={0.5} max={1.2} step={0.1} fmt={(n) => n.toFixed(1)} onChange={(n) => { set({ ttsRate: n }); speak('Guten Tag, wie geht es Ihnen?', { rate: n }); }} /></Line>
          <View style={{ gap: 8 }}>
            <Txt>Speaking feedback</Txt>
            <Row gap={6}>
              <Chip label="At the end" active={s.feedbackMode === 'end'} onPress={() => set({ feedbackMode: 'end' })} />
              <Chip label="After each message (collapsed)" active={s.feedbackMode === 'each'} onPress={() => set({ feedbackMode: 'each' })} />
            </Row>
          </View>
        </Card>
      </Section>

      <Section title="AI server">
        <Card style={{ gap: 10 }}>
          <Txt variant="small">URL of your DeutschFlow server (see server/README). Enables AI conversations, corrections, fresh daily passages and sync. The API key stays on the server.</Txt>
          <Input value={url} onChangeText={setUrl} placeholder="http://192.168.0.10:8787" keyboardType="url" />
          <Button small title="Save & test connection" loading={busy === 'server'} onPress={testServer} />
        </Card>
      </Section>

      <Section title="Account & sync">
        <Card style={{ gap: 10 }}>
          {auth.token ? (
            <>
              <Txt>Signed in as <Txt style={{ fontWeight: '700' }}>{auth.email}</Txt></Txt>
              <Txt variant="small">{lastSync ? `Last sync ${new Date(lastSync).toLocaleString()}` : 'Not synced yet'}</Txt>
              <Row>
                <Button small title="Upload" icon="cloud-upload" style={{ flex: 1 }} onPress={() => pushProgress().then(() => Alert.alert('Synced')).catch((e) => Alert.alert('Sync', e.message))} />
                <Button small kind="secondary" title="Download" icon="cloud-download" style={{ flex: 1 }} onPress={() => pullProgress().then(() => Alert.alert('Restored')).catch((e) => Alert.alert('Sync', e.message))} />
              </Row>
              <Button small kind="ghost" title="Sign out" onPress={logout} />
            </>
          ) : (
            <>
              <Txt variant="small">Optional. Your progress is always stored on this device; an account backs it up and syncs across devices.</Txt>
              <Input value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />
              <Input value={pw} onChangeText={setPw} placeholder="Password (min. 8 characters)" secureTextEntry />
              <Row>
                <Button small title="Sign in" style={{ flex: 1 }} loading={busy === 'login'} onPress={() => doAuth('login')} />
                <Button small kind="secondary" title="Create account" style={{ flex: 1 }} loading={busy === 'register'} onPress={() => doAuth('register')} />
              </Row>
            </>
          )}
        </Card>
      </Section>

      <Button
        kind="danger"
        title="Reset all progress"
        onPress={() =>
          Alert.alert('Reset everything?', 'This deletes all local progress.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Reset', style: 'destructive', onPress: () => useStore.getState().reset() },
          ])
        }
      />
      <Txt variant="small" style={{ textAlign: 'center' }}>DeutschFlow 1.0</Txt>
    </StackScreen>
  );
}
