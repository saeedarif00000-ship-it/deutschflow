import { router } from 'expo-router';
import { View } from 'react-native';

import { Card, Chip, Icon, Progress, Row, Screen, Section, Stat, Txt } from '@/components/ui';
import { QUESTIONS } from '@/data/questions';
import { isWeak, progressFor, useStore } from '@/lib/store';
import { useColors } from '@/lib/theme';

export default function Home() {
  const c = useColors();
  const s = useStore();
  const p = progressFor(QUESTIONS);
  const weak = QUESTIONS.filter((q) => isWeak(s.q[q.id])).length;
  const marked = QUESTIONS.filter((q) => s.q[q.id]?.marked).length;
  const last = s.exams.slice(0, 5);
  const passRate = last.length ? last.filter((e) => e.passed).length / last.length : 0;

  const Action = ({ icon, title, sub, onPress, color }: { icon: string; title: string; sub: string; onPress: () => void; color?: string }) => (
    <Card onPress={onPress}>
      <Row>
        <View style={{ width: 42, height: 42, borderRadius: 13, backgroundColor: (color ?? c.primary) + '22', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} color={color ?? c.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Txt variant="h3">{title}</Txt>
          <Txt variant="small">{sub}</Txt>
        </View>
        <Icon name="chevron-forward" size={16} color={c.faint} />
      </Row>
    </Card>
  );

  return (
    <Screen>
      <View>
        <Txt variant="sub">Führerschein Klasse B</Txt>
        <Txt variant="h1">FahrFlow Theorie 🚗</Txt>
      </View>

      <Card tone="primary" style={{ gap: 8 }}>
        <Txt variant="label" color={c.primaryText}>Prüfungsreife · Exam readiness</Txt>
        <Txt variant="big" color={c.primaryText}>{Math.round(p.pct * 100)}%</Txt>
        <Progress value={p.pct} color={c.accent} />
        <Txt variant="small" color={c.primaryText}>{p.learned} von {p.total} Fragen sicher gelernt (2× richtig in Folge)</Txt>
      </Card>

      <Row>
        <Stat label="Prüfungen" value={s.exams.length} icon="document-text" />
        <Stat label="Bestanden (letzte 5)" value={last.length ? `${Math.round(passRate * 100)}%` : '–'} icon="ribbon" color={c.success} />
        <Stat label="Fehlerfragen" value={weak} icon="alert-circle" color={c.danger} />
      </Row>

      <Section title="Sprache · Language">
        <Row gap={6}>
          <Chip label="Deutsch" active={s.settings.lang === 'de'} onPress={() => s.set({ lang: 'de' })} />
          <Chip label="English" active={s.settings.lang === 'en'} onPress={() => s.set({ lang: 'en' })} />
          <Chip label="Beide · Both" active={s.settings.lang === 'both'} onPress={() => s.set({ lang: 'both' })} />
        </Row>
      </Section>

      <Section title="Los geht's">
        <Action icon="timer" title="Prüfung simulieren" sub="30 Fragen · wie die echte Prüfung · bestanden mit max. 10 Fehlerpunkten" onPress={() => router.push({ pathname: '/exam-run', params: { label: 'Prüfungssimulation' } })} />
        <Action icon="shuffle" title="Gemischt lernen" sub="Unsichere Fragen zuerst · mixed practice" onPress={() => router.push('/topic/mixed')} color={c.das} />
        <Action icon="refresh" title={`Fehler wiederholen (${weak})`} sub="Fragen, die du falsch beantwortet hast" onPress={() => router.push('/topic/weak')} color={c.danger} />
        <Action icon="flag" title={`Markierte Fragen (${marked})`} sub="Mit der Flagge gemerkt" onPress={() => router.push('/topic/marked')} color={c.accent} />
        <Action icon="images" title="Bildfragen" sub="Alle Fragen mit Verkehrszeichen und Kreuzungen" onPress={() => router.push('/topic/images')} color={c.der} />
      </Section>

      <Card tone="alt" style={{ gap: 6 }}>
        <Txt variant="h3">So läuft die echte Prüfung (Klasse B, Ersterwerb)</Txt>
        <Txt variant="sub">• 30 Fragen: 20 Grundstoff + 10 Zusatzstoff Klasse B · 110 Punkte insgesamt</Txt>
        <Txt variant="sub">• Jede Frage zählt 2–5 Fehlerpunkte · bestanden mit höchstens 10 Fehlerpunkten</Txt>
        <Txt variant="sub">• Aber: zwei falsche 5-Punkte-Fragen = nicht bestanden</Txt>
        <Txt variant="sub">• Bei manchen Fragen sind mehrere Antworten richtig; manche verlangen eine Zahl</Txt>
        <Txt variant="small" style={{ marginTop: 4 }}>Hinweis: Die Fragen in dieser App sind eigene Übungsfragen zu allen Prüfungsthemen, nicht der lizenzierte amtliche Fragenkatalog. Für die Prüfung zusätzlich mit dem offiziellen Katalog (Fahrschule / TÜV / DEKRA) üben.</Txt>
      </Card>
    </Screen>
  );
}
