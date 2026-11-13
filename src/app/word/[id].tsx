import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button, Card, Empty, Row, StackScreen, Txt } from '@/components/ui';
import { WordDetail } from '@/components/WordCard';
import { displayWord, WORDS_BY_ID } from '@/data/vocab';
import { aiConfigured, explain } from '@/lib/ai';
import { intervalLabel, isMastered } from '@/lib/srs';
import { useStore } from '@/lib/store';
import { useColors } from '@/lib/theme';

export default function WordScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const w = WORDS_BY_ID[id ?? ''];
  const c = useColors();
  const card = useStore((s) => (id ? s.cards[id] : undefined));
  const introduce = useStore((s) => s.introduce);
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Opening a word (e.g. from a notification) counts as an exposure
  useEffect(() => {
    if (w && !card) introduce(w.id);
  }, [w?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!w) return <StackScreen title="Word"><Empty icon="help" title="Word not found" /></StackScreen>;

  const ask = async () => {
    setLoading(true);
    setAnswer(
      await explain(
        `Why do Germans use "${displayWord(w)}" this way? Explain nuance, register, typical collocations and when NOT to use it. Keep it short.`,
        JSON.stringify({ word: w.de, en: w.en, examples: w.examples }),
      ),
    );
    setLoading(false);
  };

  return (
    <StackScreen title={displayWord(w)}>
      <WordDetail w={w} />
      {card ? (
        <Card tone="alt" style={{ gap: 4 }}>
          <Txt variant="label">Your memory</Txt>
          <Row style={{ justifyContent: 'space-between' }}>
            <Txt variant="sub">Status</Txt>
            <Txt variant="h3" color={isMastered(card) ? c.success : c.primary}>{isMastered(card) ? 'Mastered' : card.reps === 0 ? 'New' : 'Learning'}</Txt>
          </Row>
          <Row style={{ justifyContent: 'space-between' }}>
            <Txt variant="sub">Next review</Txt>
            <Txt variant="h3">{card.due <= Date.now() ? 'now' : `in ${intervalLabel((card.due - Date.now()) / 86_400_000)}`}</Txt>
          </Row>
          <Row style={{ justifyContent: 'space-between' }}>
            <Txt variant="sub">Correct / wrong</Txt>
            <Txt variant="h3">{card.correct} / {card.wrong}</Txt>
          </Row>
        </Card>
      ) : null}
      <View style={{ gap: 10 }}>
        <Button title={aiConfigured() ? 'Why do Germans say it like this?' : 'Why do Germans say it like this? (AI)'} icon="sparkles" kind="secondary" loading={loading} onPress={ask} />
        {answer ? <Card><Txt selectable>{answer}</Txt></Card> : null}
        <Button title="Practise speaking it" icon="mic" kind="ghost" onPress={() => router.push({ pathname: '/pronunciation', params: { text: w.examples[0][0] } })} />
      </View>
    </StackScreen>
  );
}
