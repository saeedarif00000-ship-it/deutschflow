import { router } from 'expo-router';
import { View } from 'react-native';

import { Card, Icon, Progress, Row, Screen, Section, Stat, Txt } from '@/components/ui';
import { useT } from '@/lib/i18n';
import { ACHIEVEMENTS, playerLevel, streakNow } from '@/lib/learning';
import { useStore } from '@/lib/store';
import { useColors } from '@/lib/theme';

export const GAMES = [
  { type: 'daily', title: 'Daily Quiz', desc: 'Today\'s words & grammar', icon: 'today', color: 'accent' },
  { type: 'match', title: 'Word Matching', desc: 'Match German ↔ English', icon: 'git-compare', color: 'primary' },
  { type: 'article', title: 'Article Challenge', desc: 'der, die or das?', icon: 'pricetags', color: 'die' },
  { type: 'builder', title: 'Sentence Builder', desc: 'Put the words in order', icon: 'reorder-four', color: 'das' },
  { type: 'fill', title: 'Fill in the Blanks', desc: 'Complete the sentence', icon: 'create', color: 'der' },
  { type: 'listening', title: 'Listening Challenge', desc: 'Hear it, find it', icon: 'headset', color: 'primary' },
  { type: 'speed', title: 'Speed Vocabulary', desc: '60 seconds, go!', icon: 'timer', color: 'danger' },
  { type: 'battle', title: 'Grammar Battle', desc: '3 lives, endless questions', icon: 'flash', color: 'accent' },
  { type: 'memory', title: 'Memory Challenge', desc: 'Flip & match learned words', icon: 'grid', color: 'das' },
] as const;

export default function Games() {
  const c = useColors();
  const t = useT();
  const xp = useStore((s) => s.xp);
  const quizzes = useStore((s) => s.quizzes);
  const achievements = useStore((s) => s.achievements);
  const pl = playerLevel(xp);
  const playedToday = quizzes.filter((q) => new Date(q.at).toDateString() === new Date().toDateString()).length;

  return (
    <Screen title={t('games')}>
      <Card style={{ gap: 8 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Txt variant="h2">Level {pl.lvl}</Txt>
          <Txt variant="small">{xp} / {pl.next} XP</Txt>
        </Row>
        <Progress value={pl.progress} color={c.accent} />
      </Card>
      <Row>
        <Stat label="Streak" value={`${streakNow()} 🔥`} icon="flame" color={c.accent} />
        <Stat label="Played today" value={playedToday} icon="game-controller" />
        <Stat label="Badges" value={`${achievements.length}/${ACHIEVEMENTS.length}`} icon="ribbon" color={c.success} />
      </Row>
      <Section title="Daily challenge">
        <Card tone="primary" onPress={() => router.push({ pathname: '/game/[type]', params: { type: 'daily' } })}>
          <Row>
            <Icon name="trophy" color={c.primaryText} size={28} />
            <View style={{ flex: 1 }}>
              <Txt variant="h3" color={c.primaryText}>Score 8/10 in today's quiz</Txt>
              <Txt variant="small" color={c.primaryText}>+50 XP bonus</Txt>
            </View>
          </Row>
        </Card>
      </Section>
      <Section title="All games">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {GAMES.map((g) => {
            const col = (c as any)[g.color] as string;
            const best = quizzes.filter((q) => q.game === g.type).reduce((a, q) => Math.max(a, q.score), 0);
            return (
              <View key={g.type} style={{ width: '48%', flexGrow: 1 }}>
                <Card onPress={() => router.push({ pathname: '/game/[type]', params: { type: g.type } })} style={{ gap: 8, minHeight: 120 }}>
                  <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: col + '22', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={g.icon} color={col} />
                  </View>
                  <Txt variant="h3">{g.title}</Txt>
                  <Txt variant="small">{g.desc}{best ? ` · best ${best}` : ''}</Txt>
                </Card>
              </View>
            );
          })}
          <View style={{ width: '48%', flexGrow: 1 }}>
            <Card onPress={() => router.push('/speaking')} style={{ gap: 8, minHeight: 120 }}>
              <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: c.die + '22', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="chatbubbles" color={c.die} />
              </View>
              <Txt variant="h3">Conversation Simulator</Txt>
              <Txt variant="small">Doctor, landlord, job interview…</Txt>
            </Card>
          </View>
        </View>
      </Section>
    </Screen>
  );
}
