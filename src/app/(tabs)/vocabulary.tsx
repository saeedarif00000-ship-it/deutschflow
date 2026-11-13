import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, View } from 'react-native';

import { Button, Chip, Icon, Input, Row, Screen, Txt } from '@/components/ui';
import { LEVELS, type Topic } from '@/data/types';
import { VOCAB } from '@/data/vocab';
import { useT } from '@/lib/i18n';
import { stats } from '@/lib/learning';
import { isDifficult, isDue, isMastered } from '@/lib/srs';
import { useStore } from '@/lib/store';
import { genderColor, useColors } from '@/lib/theme';

const TOPICS: Topic[] = ['daily', 'university', 'work', 'shopping', 'transport', 'health', 'government', 'housing', 'travel', 'food', 'academic'];
const STATUS = ['all', 'new', 'learning', 'due', 'difficult', 'mastered', 'saved'] as const;

export default function Vocabulary() {
  const c = useColors();
  const t = useT();
  const cards = useStore((s) => s.cards);
  const favorites = useStore((s) => s.favorites);
  const [q, setQ] = useState('');
  const [level, setLevel] = useState<string | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [status, setStatus] = useState<(typeof STATUS)[number]>('all');
  const st = useMemo(() => stats(), [cards]); // eslint-disable-line react-hooks/exhaustive-deps

  const list = useMemo(() => {
    const qq = q.trim().toLowerCase();
    const now = Date.now();
    return VOCAB.filter((w) => {
      if (qq && !w.de.toLowerCase().includes(qq) && !w.en.toLowerCase().includes(qq)) return false;
      if (level && w.level !== level) return false;
      if (topic && !w.topics.includes(topic)) return false;
      const card = cards[w.id];
      switch (status) {
        case 'new': return !card;
        case 'learning': return !!card && !isMastered(card);
        case 'due': return !!card && isDue(card, now);
        case 'difficult': return !!card && isDifficult(card);
        case 'mastered': return !!card && isMastered(card);
        case 'saved': return favorites.includes(w.id);
        default: return true;
      }
    });
  }, [q, level, topic, status, cards, favorites]);

  return (
    <Screen title={t('vocabulary')} scroll={false} headerRight={<Txt variant="small">{st.learned}/{VOCAB.length} learned</Txt>}>
      <FlatList
        data={list}
        keyExtractor={(w) => w.id}
        contentContainerStyle={{ padding: 18, gap: 8, paddingBottom: 110 }}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={{ gap: 12, marginBottom: 6 }}>
            <Row>
              <Button title="Word Flow" icon="flash" onPress={() => router.push('/flow')} style={{ flex: 1 }} small />
              <Button title={`Review (${st.due})`} icon="refresh" kind="secondary" onPress={() => router.push('/review')} style={{ flex: 1 }} small />
            </Row>
            <Row>
              <Button title={t('notebook')} icon="bookmark" kind="ghost" onPress={() => router.push('/notebook')} style={{ flex: 1 }} small />
              <Button title="Word families" icon="git-network" kind="ghost" onPress={() => router.push('/families')} style={{ flex: 1 }} small />
            </Row>
            <Button title="Translator (DE ⇄ EN)" icon="language" kind="ghost" onPress={() => router.push('/translate')} small />
            <Input placeholder={t('search')} value={q} onChangeText={setQ} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              {STATUS.map((x) => <Chip key={x} label={x} active={status === x} onPress={() => setStatus(x)} />)}
            </ScrollView>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              <Chip label="All levels" active={!level} onPress={() => setLevel(null)} />
              {LEVELS.map((l) => <Chip key={l} label={l} active={level === l} onPress={() => setLevel(level === l ? null : l)} />)}
            </ScrollView>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              <Chip label="All topics" active={!topic} onPress={() => setTopic(null)} />
              {TOPICS.map((x) => <Chip key={x} label={x} active={topic === x} onPress={() => setTopic(topic === x ? null : x)} />)}
            </ScrollView>
            <Txt variant="small">{list.length} words</Txt>
          </View>
        }
        renderItem={({ item: w }) => {
          const card = cards[w.id];
          const tone = !card ? c.faint : isMastered(card) ? c.success : isDifficult(card) ? c.danger : isDue(card) ? c.accent : c.primary;
          return (
            <Pressable onPress={() => router.push(`/word/${w.id}`)} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: c.card, borderRadius: 14, padding: 14, borderWidth: 0.5, borderColor: c.border }}>
                <View style={{ width: 4, alignSelf: 'stretch', borderRadius: 2, backgroundColor: genderColor(c, w.gender) }} />
                <View style={{ flex: 1 }}>
                  <Txt variant="h3">
                    {w.gender ? <Txt variant="h3" color={genderColor(c, w.gender)}>{w.gender} </Txt> : null}
                    {w.de}
                  </Txt>
                  <Txt variant="small" numberOfLines={1}>{w.en} · {w.pos} · {w.level}</Txt>
                </View>
                {favorites.includes(w.id) ? <Icon name="bookmark" size={16} color={c.accent} /> : null}
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: tone }} />
              </View>
            </Pressable>
          );
        }}
      />
    </Screen>
  );
}
