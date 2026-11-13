import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AudioButton, Button, Card, Chip, IconButton, Progress, Row, success, Txt } from '@/components/ui';
import { GrammarFacts, WordHeader } from '@/components/WordCard';
import { WORDS_BY_ID } from '@/data/vocab';
import { buildQueue, checkAchievements } from '@/lib/learning';
import { rescheduleVocabNotifications } from '@/lib/notifications';
import { speak } from '@/lib/speech';
import { today, useStore } from '@/lib/store';
import { useColors } from '@/lib/theme';

const INTERVALS = [2, 3, 5, 10, 15, 30];

/**
 * Word Flow — the in-app learning mode. While the app is open, a new card
 * arrives exactly every N minutes (no OS background limits apply here).
 */
export default function Flow() {
  const c = useColors();
  const settings = useStore((s) => s.settings);
  const setSettings = useStore((s) => s.set);
  const introduce = useStore((s) => s.introduce);
  const grade = useStore((s) => s.grade);
  const day = useStore((s) => s.days[today()]);
  const [queue, setQueue] = useState(() => buildQueue(25));
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [left, setLeft] = useState(settings.intervalMin * 60);
  const [revealed, setRevealed] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const seen = useRef(0);

  const item = queue[idx];
  const w = item ? WORDS_BY_ID[item.wordId] : undefined;

  // introduce new words when shown
  useEffect(() => {
    if (!item || !w) return;
    setRevealed(item.kind === 'new');
    if (item.kind === 'new') introduce(w.id);
    if (autoSpeak) speak(w.gender ? `${w.gender} ${w.de}` : w.de);
    seen.current++;
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  // countdown
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(t);
  }, [paused]);

  useEffect(() => {
    if (left <= 0) next();
  }, [left]); // eslint-disable-line react-hooks/exhaustive-deps

  const next = () => {
    success();
    setLeft(settings.intervalMin * 60);
    if (idx + 1 >= queue.length) {
      setQueue(buildQueue(25));
      setIdx(0);
    } else setIdx(idx + 1);
  };

  const close = () => {
    checkAchievements();
    rescheduleVocabNotifications().catch(() => {});
    router.back();
  };

  const mm = Math.floor(left / 60);
  const ss = String(left % 60).padStart(2, '0');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <Row style={{ paddingHorizontal: 18, paddingVertical: 8, justifyContent: 'space-between' }}>
        <IconButton name="close" onPress={close} />
        <View style={{ alignItems: 'center' }}>
          <Txt variant="label">Next card in</Txt>
          <Txt variant="h2" style={{ fontVariant: ['tabular-nums'] }}>{paused ? 'Paused' : `${mm}:${ss}`}</Txt>
        </View>
        <IconButton name={paused ? 'play' : 'pause'} onPress={() => setPaused(!paused)} />
      </Row>
      <View style={{ paddingHorizontal: 18 }}>
        <Progress value={1 - left / (settings.intervalMin * 60)} height={4} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 18, gap: 14, paddingBottom: 40 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
          {INTERVALS.map((n) => (
            <Chip key={n} label={`${n} min`} active={settings.intervalMin === n} onPress={() => { setSettings({ intervalMin: n }); setLeft(n * 60); }} />
          ))}
          <Chip label={autoSpeak ? '🔊 auto' : '🔇 muted'} onPress={() => setAutoSpeak(!autoSpeak)} />
        </ScrollView>

        {w && item ? (
          <Animated.View key={idx} entering={SlideInRight.springify().damping(18)} style={{ gap: 14 }}>
            <Txt variant="label" color={item.kind === 'review' ? c.accent : c.primary}>{item.kind === 'review' ? '🔁 Do you remember?' : '✨ New word'}</Txt>
            {!revealed ? (
              <Card style={{ alignItems: 'center', gap: 12, paddingVertical: 40 }}>
                <Txt variant="big">{w.de}</Txt>
                <AudioButton text={w.de} />
                <Button title="Reveal" onPress={() => setRevealed(true)} />
              </Card>
            ) : (
              <Animated.View entering={FadeIn} style={{ gap: 12 }}>
                <Card><WordHeader w={w} big /></Card>
                <GrammarFacts w={w} />
                {w.examples.map(([de, en]) => (
                  <Card key={de} style={{ gap: 4 }}>
                    <Row style={{ alignItems: 'flex-start' }}>
                      <Txt style={{ flex: 1, fontWeight: '600' }}>{de}</Txt>
                      <AudioButton text={de} size={18} />
                    </Row>
                    <Txt variant="sub">{en}</Txt>
                  </Card>
                ))}
                <Card tone="alt"><Txt variant="sub">{w.usage}</Txt></Card>
              </Animated.View>
            )}
            {item.kind === 'review' && revealed ? (
              <Row>
                <Button title="Forgot" kind="danger" style={{ flex: 1 }} onPress={() => { grade(w.id, 0); next(); }} />
                <Button title="Knew it" kind="success" style={{ flex: 1 }} onPress={() => { grade(w.id, 2); next(); }} />
              </Row>
            ) : (
              <Row>
                <Button title="Details" kind="ghost" style={{ flex: 1 }} onPress={() => router.push(`/word/${w.id}`)} />
                <Button title="Next now" icon="play-skip-forward" style={{ flex: 1 }} onPress={next} />
              </Row>
            )}
          </Animated.View>
        ) : (
          <Card><Txt>You have seen every word at your level. Raise your level in Settings or generate more words with AI.</Txt></Card>
        )}
        <Txt variant="small" style={{ textAlign: 'center' }}>
          Today: {day?.newWords ?? 0} new · {day?.reviews ?? 0} reviews · Leave the app and notifications continue every {settings.intervalMin} min{settings.notifications ? '' : ' (enable them in Settings)'}.
        </Txt>
      </ScrollView>
    </SafeAreaView>
  );
}
