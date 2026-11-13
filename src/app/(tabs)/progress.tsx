import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Button, Card, Chip, Icon, Progress, Row, Screen, Section, Stat, Txt } from '@/components/ui';
import { GRAMMAR } from '@/data/grammar';
import { useT } from '@/lib/i18n';
import { ACHIEVEMENTS, cefrProgress, stats, streakNow, weaknesses } from '@/lib/learning';
import { today, useStore, type DayStats } from '@/lib/store';
import { useColors } from '@/lib/theme';

const METRICS: { key: keyof DayStats; label: string }[] = [
  { key: 'xp', label: 'XP' },
  { key: 'newWords', label: 'New words' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'minutes', label: 'Minutes' },
];

export default function ProgressTab() {
  const c = useColors();
  const t = useT();
  const s = useStore();
  const [metric, setMetric] = useState<keyof DayStats>('xp');
  const [range, setRange] = useState<7 | 30>(7);
  const [hover, setHover] = useState<number | null>(null);
  const st = useMemo(() => stats(), [s.cards]); // eslint-disable-line react-hooks/exhaustive-deps
  const cefr = useMemo(() => cefrProgress(), [s.cards, s.grammarDone, s.readingDone]); // eslint-disable-line react-hooks/exhaustive-deps
  const weak = useMemo(() => weaknesses().slice(0, 5), [s.skill, s.cards]); // eslint-disable-line react-hooks/exhaustive-deps

  const series = Array.from({ length: range }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (range - 1 - i));
    const k = today(d);
    return { k, label: range === 7 ? d.toLocaleDateString('de-DE', { weekday: 'short' }) : String(d.getDate()), v: (s.days[k]?.[metric] as number) ?? 0 };
  });
  const max = Math.max(1, ...series.map((x) => x.v));
  const total = series.reduce((a, b) => a + b.v, 0);
  const quizAvg = s.quizzes.filter((q) => q.total).length
    ? Math.round((s.quizzes.filter((q) => q.total).reduce((a, q) => a + q.score / q.total, 0) / s.quizzes.filter((q) => q.total).length) * 100)
    : 0;
  const speakMin = Math.round(s.speakingLog.reduce((a, b) => a + b.sec, 0) / 60);
  const estLevel = [...cefr].reverse().find((x) => x.pct >= 0.6)?.level ?? 'Pre-A1';

  return (
    <Screen title={t('progress')}>
      <Card tone="primary" style={{ gap: 4 }}>
        <Txt variant="label" color={c.primaryText}>Estimated CEFR level</Txt>
        <Txt variant="big" color={c.primaryText}>{estLevel}</Txt>
        <Txt variant="small" color={c.primaryText}>Studying at {s.settings.level} · based on vocabulary, grammar & reading coverage</Txt>
      </Card>

      <Row>
        <Stat label={t('wordsLearned')} value={st.learned} icon="albums" />
        <Stat label={t('mastered')} value={st.mastered} icon="ribbon" color={c.success} />
        <Stat label={t('toRevise')} value={st.revision} icon="refresh" color={c.accent} />
      </Row>
      <Row>
        <Stat label="Grammar topics" value={`${Object.keys(s.grammarDone).length}/${GRAMMAR.length}`} icon="construct" />
        <Stat label="Passages read" value={Object.keys(s.readingDone).length} icon="book" />
        <Stat label="Speaking min" value={speakMin} icon="mic" color={c.die} />
      </Row>
      <Row>
        <Stat label="Avg quiz score" value={`${quizAvg}%`} icon="trophy" color={c.accent} />
        <Stat label="Streak" value={`${streakNow()} 🔥`} icon="flame" color={c.accent} />
        <Stat label="Total XP" value={s.xp} icon="star" color={c.success} />
      </Row>

      <Section title="Activity">
        <Card style={{ gap: 12 }}>
          <Row gap={6} style={{ flexWrap: 'wrap' }}>
            {METRICS.map((m) => <Chip key={m.key} label={m.label} active={metric === m.key} onPress={() => setMetric(m.key)} />)}
            <View style={{ flex: 1 }} />
            <Chip label="7d" active={range === 7} onPress={() => setRange(7)} />
            <Chip label="30d" active={range === 30} onPress={() => setRange(30)} />
          </Row>
          <Txt variant="h2">
            {hover !== null ? `${series[hover].v} ${METRICS.find((m) => m.key === metric)!.label}` : `${total} ${METRICS.find((m) => m.key === metric)!.label}`}
          </Txt>
          <Txt variant="small">{hover !== null ? series[hover].k : `last ${range} days · tap a bar`}</Txt>
          <View style={{ height: 130, flexDirection: 'row', alignItems: 'flex-end', gap: range === 7 ? 10 : 2, borderBottomWidth: 1, borderBottomColor: c.border }}>
            {series.map((x, i) => (
              <Pressable key={x.k} onPress={() => setHover(hover === i ? null : i)} style={{ flex: 1, height: '100%', justifyContent: 'flex-end' }}>
                <View style={{ height: `${(x.v / max) * 100}%`, minHeight: x.v ? 3 : 0, backgroundColor: hover === null || hover === i ? c.primary : c.primary + '55', borderTopLeftRadius: 4, borderTopRightRadius: 4 }} />
              </Pressable>
            ))}
          </View>
          {range === 7 ? (
            <Row gap={10}>
              {series.map((x) => <Txt key={x.k} variant="small" style={{ flex: 1, textAlign: 'center' }}>{x.label}</Txt>)}
            </Row>
          ) : null}
        </Card>
      </Section>

      <Section title="CEFR progress">
        <Card style={{ gap: 12 }}>
          {cefr.map((x) => (
            <View key={x.level} style={{ gap: 4 }}>
              <Row style={{ justifyContent: 'space-between' }}>
                <Txt variant="h3">{x.level}</Txt>
                <Txt variant="small">{Math.round(x.pct * 100)}%</Txt>
              </Row>
              <Progress value={x.pct} color={x.pct >= 0.6 ? c.success : c.primary} />
            </View>
          ))}
        </Card>
      </Section>

      <Section title="Strengths & weaknesses">
        {weak.length ? (
          <Card style={{ gap: 10 }}>
            {weak.map((w) => (
              <Pressable key={w.tag} onPress={() => router.push({ pathname: '/game/[type]', params: { type: 'battle', tag: w.tag } })} style={{ gap: 4 }}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Txt>{w.label}</Txt>
                  <Txt variant="small" color={w.accuracy < 0.6 ? c.danger : w.accuracy < 0.8 ? c.accent : c.success}>{Math.round(w.accuracy * 100)}%</Txt>
                </Row>
                <Progress value={w.accuracy} height={5} color={w.accuracy < 0.6 ? c.danger : w.accuracy < 0.8 ? c.accent : c.success} />
              </Pressable>
            ))}
            <Txt variant="small">Tap a topic to practise it in Grammar Battle.</Txt>
          </Card>
        ) : (
          <Txt variant="sub">Do some grammar lessons and games — your AI teacher will map your strengths here.</Txt>
        )}
      </Section>

      {st.difficult.length ? (
        <Section title="Difficult words">
          <Button title={`Practise ${st.difficult.length} difficult words`} icon="barbell" kind="secondary" onPress={() => router.push('/review')} />
        </Section>
      ) : null}

      <Section title={t('achievements')}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {ACHIEVEMENTS.map((a) => {
            const got = s.achievements.includes(a.id);
            return (
              <View key={a.id} style={{ width: '30%', flexGrow: 1, alignItems: 'center', gap: 4, padding: 10, borderRadius: 14, backgroundColor: c.card, opacity: got ? 1 : 0.4, borderWidth: 0.5, borderColor: c.border }}>
                <Icon name={a.icon} color={got ? c.accent : c.faint} size={24} />
                <Txt variant="small" style={{ fontWeight: '700', textAlign: 'center' }}>{a.title}</Txt>
                <Txt variant="small" style={{ textAlign: 'center', fontSize: 10.5 }}>{a.desc}</Txt>
              </View>
            );
          })}
        </View>
      </Section>

      <Button title={t('mistakes')} icon="create" kind="ghost" onPress={() => router.push('/notebook')} />
    </Screen>
  );
}
