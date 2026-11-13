import { router } from 'expo-router';
import { View } from 'react-native';

import { Button, Card, Icon, Row, Screen, Section, Txt } from '@/components/ui';
import { PRACTICE_SHEETS, useStore } from '@/lib/store';
import { useColors } from '@/lib/theme';

export default function Exam() {
  const c = useColors();
  const exams = useStore((s) => s.exams);
  return (
    <Screen title="Prüfung">
      <Card tone="primary" style={{ gap: 8 }}>
        <Txt variant="h2" color={c.primaryText}>Prüfungssimulation</Txt>
        <Txt color={c.primaryText} style={{ opacity: 0.9 }}>30 zufällige Fragen, Bewertung wie bei TÜV/DEKRA: max. 10 Fehlerpunkte, nicht zwei 5-Punkte-Fehler. Lösungen erst am Ende.</Txt>
        <Button title="Starten" icon="play" kind="secondary" onPress={() => router.push({ pathname: '/exam-run', params: { label: 'Prüfungssimulation' } })} />
      </Card>

      <Section title="Übungsbögen · Practice sheets">
        <Txt variant="small">Feste Bögen mit immer gleichen 30 Fragen – ideal, um Fortschritt zu vergleichen. (Echte Prüfungsbögen werden nicht veröffentlicht; die Prüfung zieht zufällig aus dem amtlichen Katalog.)</Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {PRACTICE_SHEETS.map((p) => {
            const runs = exams.filter((e) => e.label === p.label);
            const best = runs.length ? Math.min(...runs.map((r) => r.errorPoints)) : null;
            const passed = runs.some((r) => r.passed);
            return (
              <View key={p.id} style={{ width: '48%', flexGrow: 1 }}>
                <Card onPress={() => router.push({ pathname: '/exam-run', params: { seed: String(p.seed), label: p.label } })} style={{ gap: 4 }}>
                  <Row style={{ justifyContent: 'space-between' }}>
                    <Txt variant="h3">{p.label}</Txt>
                    {runs.length ? <Icon name={passed ? 'checkmark-circle' : 'close-circle'} color={passed ? c.success : c.danger} size={18} /> : null}
                  </Row>
                  <Txt variant="small">{best === null ? 'Noch nicht gemacht' : `Bestes Ergebnis: ${best} Fehlerpunkte`}</Txt>
                </Card>
              </View>
            );
          })}
        </View>
      </Section>

      <Section title="Verlauf · History">
        {exams.length ? (
          exams.slice(0, 15).map((e) => (
            <Card key={e.id} onPress={() => router.push(`/result/${e.id}`)}>
              <Row>
                <Icon name={e.passed ? 'checkmark-circle' : 'close-circle'} color={e.passed ? c.success : c.danger} />
                <View style={{ flex: 1 }}>
                  <Txt variant="h3">{e.passed ? 'Bestanden' : 'Nicht bestanden'} · {e.errorPoints} Fehlerpunkte</Txt>
                  <Txt variant="small">{e.label} · {new Date(e.at).toLocaleString('de-DE')}</Txt>
                </View>
                <Icon name="chevron-forward" size={16} color={c.faint} />
              </Row>
            </Card>
          ))
        ) : (
          <Txt variant="sub">Noch keine Prüfung gemacht.</Txt>
        )}
      </Section>
    </Screen>
  );
}
