import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { Card, Chip, Row, StackScreen, Txt } from '@/components/ui';
import { displayWord, VOCAB, WORDS_BY_ID } from '@/data/vocab';
import { useColors } from '@/lib/theme';

/** Word family explorer: shows how one root branches into nouns, verbs and adjectives */
export default function Families() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const c = useColors();
  const list = id && WORDS_BY_ID[id] ? [WORDS_BY_ID[id], ...VOCAB.filter((w) => w.id !== id && w.family?.length)] : VOCAB.filter((w) => w.family?.length);
  const classify = (f: string) =>
    /^(der|die|das) /.test(f) ? 'noun' : /(en|ern|eln)$/.test(f) && f[0] === f[0].toLowerCase() ? 'verb' : 'adj/adv';
  return (
    <StackScreen title="Word families">
      <Txt variant="sub">Learn one root, unlock many words. Tap a family member to open it if it's in your library.</Txt>
      {list.map((w, i) => (
        <Card key={w.id} style={{ gap: 10, borderWidth: i === 0 && id ? 1.5 : undefined, borderColor: i === 0 && id ? c.primary : undefined }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Txt variant="h2" >{displayWord(w)}</Txt>
            <Chip label="open" onPress={() => router.push(`/word/${w.id}`)} />
          </Row>
          <Txt variant="small">{w.en}</Txt>
          {(['noun', 'verb', 'adj/adv'] as const).map((k) => {
            const items = (w.family ?? []).filter((f) => classify(f) === k);
            if (!items.length) return null;
            return (
              <View key={k} style={{ gap: 6 }}>
                <Txt variant="label">{k}</Txt>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {items.map((f) => {
                    const target = VOCAB.find((v) => displayWord(v).toLowerCase() === f.toLowerCase() || v.de.toLowerCase() === f.toLowerCase());
                    return <Chip key={f} label={f} active={!!target} onPress={target ? () => router.push(`/word/${target.id}`) : undefined} />;
                  })}
                </View>
              </View>
            );
          })}
        </Card>
      ))}
    </StackScreen>
  );
}
