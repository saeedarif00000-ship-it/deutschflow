import { router } from 'expo-router';
import { useMemo } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AudioButton, Button, Card, Icon, IconButton, Pill, Progress, Row, Screen, Section, Stat, Txt } from '@/components/ui';
import { GenderTag } from '@/components/WordCard';
import { EXPRESSIONS } from '@/data/scenarios';
import { displayWord } from '@/data/vocab';
import { useT } from '@/lib/i18n';
import { dailyPlan, playerLevel, stats, wordOfTheDay } from '@/lib/learning';
import { streak, today, useStore } from '@/lib/store';
import { genderColor, useColors } from '@/lib/theme';

export default function Home() {
  const c = useColors();
  const t = useT();
  const s = useStore();
  const level = s.settings.level;
  const day = s.days[today()];
  const st = useMemo(() => stats(), [s.cards]); // eslint-disable-line react-hooks/exhaustive-deps
  const plan = useMemo(() => dailyPlan(), [s.cards, s.days, s.grammarDone, s.readingDone, s.skill, level]); // eslint-disable-line react-hooks/exhaustive-deps
  const wotd = wordOfTheDay(level);
  const str = streak(s.days);
  const pl = playerLevel(s.xp);
  const expr = EXPRESSIONS[Math.floor(Date.now() / 86_400_000) % EXPRESSIONS.length];
  const hour = new Date().getHours();
  const greet = hour < 11 ? 'Guten Morgen' : hour < 18 ? 'Guten Tag' : 'Guten Abend';
  const wordsGoal = (day?.newWords ?? 0) / s.settings.dailyGoalWords;
  const minGoal = (day?.minutes ?? 0) / s.settings.dailyGoalMinutes;

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <View>
          <Txt variant="sub">{greet} 👋</Txt>
          <Txt variant="h1">DeutschFlow</Txt>
        </View>
        <Row>
          <Pill text={`${level} · Lv ${pl.lvl}`} />
          <IconButton name="settings-outline" onPress={() => router.push('/settings')} />
        </Row>
      </Row>

      <Row>
        <Stat label={t('streak')} value={`${str} 🔥`} icon="flame" color={c.accent} />
        <Stat label={t('wordsLearned')} value={st.learned} icon="albums" />
        <Stat label="XP" value={s.xp} icon="star" color={c.success} />
      </Row>

      <Animated.View entering={FadeInDown.duration(400)}>
        <Card onPress={() => router.push(`/word/${wotd.id}`)} style={{ gap: 10, borderTopWidth: 4, borderTopColor: genderColor(c, wotd.gender) }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Txt variant="label">{t('wordOfDay')}</Txt>
            <AudioButton text={displayWord(wotd)} />
          </Row>
          <Txt variant="big">
            {wotd.gender ? <Txt variant="big" color={genderColor(c, wotd.gender)}>{wotd.gender} </Txt> : null}
            {wotd.de}
          </Txt>
          <Row gap={8}>
            <Txt variant="h3" color={c.sub}>{wotd.en}</Txt>
            <GenderTag g={wotd.gender} />
          </Row>
          <Txt variant="sub" style={{ fontStyle: 'italic' }}>„{wotd.examples[0][0]}“</Txt>
        </Card>
      </Animated.View>

      <Card tone="primary" onPress={() => router.push('/flow')} style={{ gap: 6 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Txt variant="h2" color={c.primaryText}>⚡ Word Flow</Txt>
          <Icon name="arrow-forward" color={c.primaryText} />
        </Row>
        <Txt color={c.primaryText} style={{ opacity: 0.9 }}>
          A new card every {s.settings.intervalMin} min while you study — mixed with reviews at the right time.
        </Txt>
      </Card>

      <Section title={t('dailyGoal')}>
        <Card style={{ gap: 12 }}>
          <View style={{ gap: 6 }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Txt variant="sub">New words</Txt>
              <Txt variant="h3">{day?.newWords ?? 0}/{s.settings.dailyGoalWords}</Txt>
            </Row>
            <Progress value={wordsGoal} />
          </View>
          <View style={{ gap: 6 }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Txt variant="sub">Study minutes</Txt>
              <Txt variant="h3">{day?.minutes ?? 0}/{s.settings.dailyGoalMinutes}</Txt>
            </Row>
            <Progress value={minGoal} color={c.success} />
          </View>
          {st.due > 0 ? <Button title={`Review ${st.due} due word${st.due > 1 ? 's' : ''}`} icon="refresh" onPress={() => router.push('/review')} /> : null}
        </Card>
      </Section>

      <Section title={t('todaysPlan')} right={<Txt variant="small">AI teacher · adapts to you</Txt>}>
        {plan.map((p, i) => (
          <Animated.View key={p.id} entering={FadeInDown.delay(i * 50)}>
            <Card onPress={() => router.push(p.href as any)} style={{ gap: 4 }}>
              <Row>
                <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: p.done ? c.success + '22' : c.cardAlt, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={p.done ? 'checkmark' : p.icon} size={18} color={p.done ? c.success : c.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Txt variant="h3" style={p.done ? { textDecorationLine: 'line-through', color: c.faint } : undefined}>{p.title}</Txt>
                  <Txt variant="small">{p.subtitle}</Txt>
                </View>
                <Icon name="chevron-forward" size={16} color={c.faint} />
              </Row>
              {p.reason ? <Txt variant="small" color={c.accent}>💡 {p.reason}</Txt> : null}
            </Card>
          </Animated.View>
        ))}
      </Section>

      <Section title={t('quickSpeak')}>
        <Card onPress={() => router.push({ pathname: '/chat', params: { level } })}>
          <Row>
            <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: c.die + '22', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="mic" color={c.die} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt variant="h3">Talk with your AI teacher</Txt>
              <Txt variant="small">Free conversation at {level} · corrections after you finish</Txt>
            </View>
          </Row>
        </Card>
      </Section>

      <Card onPress={() => router.push('/translate')}>
        <Row>
          <Icon name="language" color={c.primary} />
          <View style={{ flex: 1 }}>
            <Txt variant="h3">Translator</Txt>
            <Txt variant="small">German ⇄ English · word by word or full sentences</Txt>
          </View>
          <Icon name="chevron-forward" size={16} color={c.faint} />
        </Row>
      </Card>

      <Section title="Say it like a German" right={<Txt variant="small" color={c.primary}>All →</Txt>}>
        <Card onPress={() => router.push('/expressions')} style={{ gap: 6 }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Txt variant="h2">{expr.de}</Txt>
            <Pill text={expr.register} color={c.accent} />
          </Row>
          <Txt variant="sub">{expr.en}</Txt>
          <Txt variant="small">Why? {expr.why}</Txt>
        </Card>
      </Section>
    </Screen>
  );
}
