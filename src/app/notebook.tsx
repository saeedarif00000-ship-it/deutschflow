import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { Button, Card, Chip, Empty, IconButton, Pill, Row, StackScreen, Txt } from '@/components/ui';
import { TAG_LABEL } from '@/data/grammar';
import { displayWord, WORDS_BY_ID } from '@/data/vocab';
import { useStore } from '@/lib/store';
import { genderColor, useColors } from '@/lib/theme';

export default function Notebook() {
  const c = useColors();
  const [tab, setTab] = useState<'words' | 'mistakes'>('words');
  const favorites = useStore((s) => s.favorites);
  const mistakes = useStore((s) => s.mistakes);
  const removeMistake = useStore((s) => s.removeMistake);
  const [kind, setKind] = useState<string>('all');
  const kinds = ['all', 'grammar', 'speaking', 'vocab', 'reading'];
  const shown = mistakes.filter((m) => kind === 'all' || m.kind === kind);
  const byTag = mistakes.reduce<Record<string, number>>((a, m) => (m.tag ? { ...a, [m.tag]: (a[m.tag] ?? 0) + 1 } : a), {});

  return (
    <StackScreen title="Notebook">
      <Row>
        <Chip label={`★ Saved words (${favorites.length})`} active={tab === 'words'} onPress={() => setTab('words')} />
        <Chip label={`✏️ Mistakes (${mistakes.length})`} active={tab === 'mistakes'} onPress={() => setTab('mistakes')} />
      </Row>

      {tab === 'words' ? (
        favorites.length ? (
          <View style={{ gap: 8 }}>
            {favorites.map((id) => WORDS_BY_ID[id]).filter(Boolean).map((w) => (
              <Card key={w.id} onPress={() => router.push(`/word/${w.id}`)}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <View>
                    <Txt variant="h3" color={genderColor(c, w.gender)}>{displayWord(w)}</Txt>
                    <Txt variant="small">{w.en}</Txt>
                  </View>
                  <Pill text={w.level} />
                </Row>
              </Card>
            ))}
            <Button title="Quiz my saved words" icon="game-controller" onPress={() => router.push({ pathname: '/game/[type]', params: { type: 'match', source: 'saved' } })} />
          </View>
        ) : (
          <Empty icon="bookmark-outline" title="No saved words yet" text="Tap the bookmark on any word card to save it here." />
        )
      ) : (
        <>
          {Object.keys(byTag).length ? (
            <Card tone="alt" style={{ gap: 6 }}>
              <Txt variant="h3">Patterns</Txt>
              {Object.entries(byTag).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([t, n]) => (
                <Pressable key={t} onPress={() => router.push({ pathname: '/game/[type]', params: { type: 'battle', tag: t } })}>
                  <Txt variant="sub">• {TAG_LABEL[t] ?? t}: {n} mistake{n > 1 ? 's' : ''} → <Txt variant="sub" color={c.primary}>practise</Txt></Txt>
                </Pressable>
              ))}
            </Card>
          ) : null}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
            {kinds.map((k) => <Chip key={k} label={k} active={kind === k} onPress={() => setKind(k)} />)}
          </ScrollView>
          {shown.length ? (
            shown.map((m) => (
              <Card key={m.id} style={{ gap: 4, borderLeftWidth: 4, borderLeftColor: c.accent }}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Row gap={6}><Pill text={m.kind} />{m.tag ? <Pill text={TAG_LABEL[m.tag] ?? m.tag} color={c.sub} /> : null}</Row>
                  <IconButton name="checkmark" size={16} onPress={() => removeMistake(m.id)} />
                </Row>
                <Txt color={c.danger}>{m.wrong}</Txt>
                <Txt color={c.success} style={{ fontWeight: '700' }}>✓ {m.right}</Txt>
                <Txt variant="small">{m.explanation}</Txt>
              </Card>
            ))
          ) : (
            <Empty icon="sparkles" title="No mistakes logged" text="Mistakes from grammar, games and conversations are collected here so you can learn from them." />
          )}
        </>
      )}
    </StackScreen>
  );
}
