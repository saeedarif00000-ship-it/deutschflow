import { Alert, Pressable, View } from 'react-native';

import { Button, Card, Chip, Progress, Row, Screen, Section, Txt } from '@/components/ui';
import { QUESTIONS, TOPICS } from '@/data/questions';
import { useStore } from '@/lib/store';
import { useColors } from '@/lib/theme';

export default function Stats() {
  const c = useColors();
  const s = useStore();
  const exams = [...s.exams].reverse().slice(-12);
  const max = Math.max(12, ...exams.map((e) => e.errorPoints));
  return (
    <Screen title="Statistik">
      <Section title="Fehlerpunkte der letzten Prüfungen">
        <Card style={{ gap: 8 }}>
          {exams.length ? (
            <>
              <View style={{ height: 130, flexDirection: 'row', alignItems: 'flex-end', gap: 6, borderBottomWidth: 1, borderBottomColor: c.border }}>
                {exams.map((e) => (
                  <View key={e.id} style={{ flex: 1, height: '100%', justifyContent: 'flex-end' }}>
                    <View style={{ height: `${(e.errorPoints / max) * 100}%`, minHeight: 3, backgroundColor: e.passed ? c.success : c.danger, borderTopLeftRadius: 4, borderTopRightRadius: 4 }} />
                  </View>
                ))}
              </View>
              <Txt variant="small">Grün = bestanden (≤ 10 Fehlerpunkte), Rot = nicht bestanden</Txt>
            </>
          ) : (
            <Txt variant="sub">Noch keine Prüfungen – starte eine Simulation.</Txt>
          )}
        </Card>
      </Section>
      <Section title="Themen · Treffsicherheit">
        <Card style={{ gap: 12 }}>
          {TOPICS.map((t) => {
            const list = QUESTIONS.filter((q) => q.topic === t.id);
            let r = 0, w = 0;
            list.forEach((q) => { r += s.q[q.id]?.right ?? 0; w += s.q[q.id]?.wrong ?? 0; });
            const acc = r + w ? r / (r + w) : 0;
            return (
              <View key={t.id} style={{ gap: 4 }}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Txt>{t.de}</Txt>
                  <Txt variant="small" color={r + w === 0 ? c.faint : acc >= 0.8 ? c.success : acc >= 0.6 ? c.accent : c.danger}>{r + w ? `${Math.round(acc * 100)}%` : '–'}</Txt>
                </Row>
                <Progress value={acc} height={5} color={acc >= 0.8 ? c.success : acc >= 0.6 ? c.accent : c.danger} />
              </View>
            );
          })}
        </Card>
      </Section>
      <Section title="Einstellungen">
        <Row gap={6}>
          {(['system', 'light', 'dark'] as const).map((t) => <Chip key={t} label={t === 'system' ? 'System' : t === 'light' ? 'Hell' : 'Dunkel'} active={s.settings.theme === t} onPress={() => s.set({ theme: t })} />)}
        </Row>
        <Button kind="danger" title="Fortschritt zurücksetzen" onPress={() => Alert.alert('Zurücksetzen?', 'Alle Ergebnisse werden gelöscht.', [{ text: 'Abbrechen', style: 'cancel' }, { text: 'Löschen', style: 'destructive', onPress: () => s.reset() }])} />
      </Section>
      <Pressable><Txt variant="small" style={{ textAlign: 'center' }}>FahrFlow Theorie 1.0 · Übungsfragen, keine amtlichen Prüfungsfragen</Txt></Pressable>
    </Screen>
  );
}
