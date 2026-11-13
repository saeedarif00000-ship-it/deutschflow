import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { AudioButton, Button, Card, Chip, Icon, Progress, Row, StackScreen, Txt } from '@/components/ui';
import { PRONUNCIATION } from '@/data/scenarios';
import { similarity, speak, useGermanRecognizer } from '@/lib/speech';
import { useStore } from '@/lib/store';
import { useColors } from '@/lib/theme';

export default function Pronunciation() {
  const { text } = useLocalSearchParams<{ text?: string }>();
  const c = useColors();
  const [target, setTarget] = useState(text ?? PRONUNCIATION[0].words[0]);
  const [open, setOpen] = useState(0);
  const rec = useGermanRecognizer();
  const score = rec.transcript && !rec.listening ? similarity(rec.transcript, target) : null;

  const pick = (w: string) => {
    setTarget(w);
    rec.setTranscript('');
    speak(w, { rate: 0.75 });
  };

  return (
    <StackScreen title="Pronunciation">
      <Card style={{ alignItems: 'center', gap: 12, paddingVertical: 24 }}>
        <Txt variant="label">Say this</Txt>
        <Txt variant="big" style={{ textAlign: 'center' }}>{target}</Txt>
        <Row>
          <Button small kind="secondary" icon="play" title="Normal" onPress={() => speak(target)} />
          <Button small kind="secondary" icon="hourglass" title="Slow" onPress={() => speak(target, { rate: 0.55 })} />
        </Row>
        <Pressable
          onPress={() => (rec.listening ? rec.stop() : rec.start())}
          style={{ width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center', backgroundColor: rec.listening ? c.danger : c.primary }}>
          <Icon name={rec.listening ? 'stop' : 'mic'} color="#fff" size={32} />
        </Pressable>
        <Txt variant="small">{rec.listening ? 'Listening… tap to stop when done' : 'Tap and say it'}</Txt>
        {rec.error ? <Txt variant="small" color={c.danger} style={{ textAlign: 'center' }}>{rec.error}</Txt> : null}
        {rec.transcript ? <Txt variant="sub">Heard: „{rec.transcript}“</Txt> : null}
        {score !== null ? (
          <View style={{ alignSelf: 'stretch', gap: 6 }}>
            <Progress value={score} color={score > 0.85 ? c.success : score > 0.6 ? c.accent : c.danger} height={10} />
            <Txt variant="h3" style={{ textAlign: 'center' }} color={score > 0.85 ? c.success : score > 0.6 ? c.accent : c.danger}>
              {score > 0.85 ? 'Ausgezeichnet!' : score > 0.6 ? 'Fast! Listen again and focus on the highlighted sound.' : 'Try again slowly.'} ({Math.round(score * 100)}%)
            </Txt>
            {score > 0.6 ? null : <Button small kind="ghost" title="Listen slowly" onPress={() => speak(target, { rate: 0.5 })} />}
          </View>
        ) : null}
        {!rec.available ? (
          <Row>
            <Txt variant="small">Self-check:</Txt>
            <Chip label="😕 Hard" onPress={() => useStore.getState().recordSkill('aussprache', false)} />
            <Chip label="🙂 Got it" onPress={() => useStore.getState().recordSkill('aussprache', true)} />
          </Row>
        ) : null}
      </Card>

      {PRONUNCIATION.map((p, i) => (
        <Card key={p.sound} onPress={() => setOpen(open === i ? -1 : i)} style={{ gap: 8 }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Txt variant="h3">{p.sound}</Txt>
            <Icon name={open === i ? 'chevron-up' : 'chevron-down'} size={16} color={c.faint} />
          </Row>
          {open === i ? (
            <>
              <Txt variant="sub">{p.tip}</Txt>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {p.words.map((w) => (
                  <Row key={w} gap={4}>
                    <Chip label={w} active={target === w} onPress={() => pick(w)} />
                    <AudioButton text={w} size={16} />
                  </Row>
                ))}
              </View>
            </>
          ) : null}
        </Card>
      ))}
    </StackScreen>
  );
}
