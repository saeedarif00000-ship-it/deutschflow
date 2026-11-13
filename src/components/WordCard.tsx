import { router } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import type { Word } from '@/data/types';
import { displayWord, VOCAB } from '@/data/vocab';
import { useT } from '@/lib/i18n';
import { useStore } from '@/lib/store';
import { genderColor, useColors } from '@/lib/theme';
import { AudioButton, Card, Chip, IconButton, Pill, Row, Txt } from './ui';

const GENDER_LABEL = { der: 'masculine', die: 'feminine', das: 'neuter' } as const;

export function GenderTag({ g }: { g?: Word['gender'] }) {
  const c = useColors();
  if (!g) return null;
  return <Pill text={`${g} · ${GENDER_LABEL[g]}`} color={genderColor(c, g)} />;
}

function findWordLink(term: string) {
  const clean = term.replace(/^(der|die|das|sich|etw\.)\s+/i, '').toLowerCase();
  return VOCAB.find((w) => w.de.toLowerCase() === clean || w.de.toLowerCase() === term.toLowerCase());
}

export function WordHeader({ w, big }: { w: Word; big?: boolean }) {
  const c = useColors();
  const fav = useStore((s) => s.favorites.includes(w.id));
  const toggle = useStore((s) => s.toggleFavorite);
  return (
    <View style={{ gap: 8 }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Row gap={6}>
          <Pill text={w.level} />
          <Pill text={w.pos} color={c.sub} />
        </Row>
        <Row gap={8}>
          <AudioButton text={displayWord(w)} />
          <IconButton name={fav ? 'bookmark' : 'bookmark-outline'} color={fav ? c.accent : c.text} onPress={() => toggle(w.id)} />
        </Row>
      </Row>
      <Txt variant={big ? 'big' : 'h1'}>
        {w.gender ? <Txt variant={big ? 'big' : 'h1'} color={genderColor(c, w.gender)}>{w.gender} </Txt> : null}
        {w.de}
      </Txt>
      <Txt variant="h3" color={c.sub}>{w.en}</Txt>
      <Txt variant="small">/{w.phonetic}/</Txt>
    </View>
  );
}

export function GrammarFacts({ w }: { w: Word }) {
  const c = useColors();
  if (w.pos === 'noun')
    return (
      <Card tone="alt" style={{ gap: 6 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Txt variant="sub">Article</Txt>
          <GenderTag g={w.gender} />
        </Row>
        <Row style={{ justifyContent: 'space-between' }}>
          <Txt variant="sub">Plural</Txt>
          <Txt variant="h3">{w.plural}</Txt>
        </Row>
      </Card>
    );
  if (w.verb)
    return (
      <Card tone="alt" style={{ gap: 6 }}>
        {[
          ['Infinitiv', w.de],
          ['Präsens (er/sie/es)', w.verb.present],
          ['Präteritum', w.verb.praeteritum],
          ['Perfekt', w.verb.perfekt],
        ].map(([k, v]) => (
          <Row key={k} style={{ justifyContent: 'space-between' }}>
            <Txt variant="sub">{k}</Txt>
            <Row gap={6}>
              <Txt variant="h3" color={k === 'Infinitiv' ? c.primary : undefined}>{v}</Txt>
            </Row>
          </Row>
        ))}
      </Card>
    );
  return null;
}

export function WordDetail({ w }: { w: Word }) {
  const c = useColors();
  const t = useT();
  const links = (items?: string[]) =>
    items?.length ? (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {items.map((r) => {
          const target = findWordLink(r);
          return <Chip key={r} label={r} active={false} onPress={target ? () => router.push(`/word/${target.id}`) : undefined} />;
        })}
      </View>
    ) : null;

  return (
    <View style={{ gap: 16 }}>
      <Card>
        <WordHeader w={w} big />
      </Card>
      <GrammarFacts w={w} />
      <Animated.View entering={FadeInDown.delay(60)} style={{ gap: 10 }}>
        <Txt variant="label">{t('examples')}</Txt>
        {w.examples.map(([de, en]) => (
          <Card key={de} style={{ gap: 4 }}>
            <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Txt variant="body" style={{ flex: 1, fontWeight: '600' }} selectable>{de}</Txt>
              <AudioButton text={de} size={18} />
            </Row>
            <Txt variant="sub">{en}</Txt>
          </Card>
        ))}
      </Animated.View>
      <Card style={{ gap: 6 }}>
        <Txt variant="label">{t('usage')}</Txt>
        <Txt>{w.usage}</Txt>
      </Card>
      {w.mistakes ? (
        <Card style={{ gap: 6, borderLeftWidth: 4, borderLeftColor: c.danger }}>
          <Txt variant="label">{t('commonMistakes')}</Txt>
          <Txt>{w.mistakes}</Txt>
        </Card>
      ) : null}
      {w.synonyms?.length ? <View style={{ gap: 8 }}><Txt variant="label">Synonyms</Txt>{links(w.synonyms)}</View> : null}
      {w.antonyms?.length ? <View style={{ gap: 8 }}><Txt variant="label">Antonyms</Txt>{links(w.antonyms)}</View> : null}
      {w.family?.length ? (
        <Pressable onPress={() => router.push({ pathname: '/families', params: { id: w.id } })} style={{ gap: 8 }}>
          <Txt variant="label">{t('family')} →</Txt>
          {links(w.family)}
        </Pressable>
      ) : null}
      {w.related?.length ? <View style={{ gap: 8 }}><Txt variant="label">{t('related')}</Txt>{links(w.related)}</View> : null}
    </View>
  );
}
