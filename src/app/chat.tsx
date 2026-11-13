import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { AudioButton, Button, Card, Chip, Icon, Pill, Row, StackScreen, Txt } from '@/components/ui';
import { SCENARIOS } from '@/data/scenarios';
import type { Level } from '@/data/types';
import { tutorChat, type ChatTurn, type Correction } from '@/lib/ai';
import { checkAchievements } from '@/lib/learning';
import { speak, stopSpeaking, useGermanRecognizer } from '@/lib/speech';
import { useStore } from '@/lib/store';
import { useColors } from '@/lib/theme';

interface Msg {
  role: 'user' | 'assistant';
  text: string;
  en?: string;
  corrections?: Correction[];
  natural?: string;
}

export default function Chat() {
  const p = useLocalSearchParams<{ level?: string; scenario?: string; topic?: string }>();
  const c = useColors();
  const settings = useStore((s) => s.settings);
  const level = (p.level as Level) ?? settings.level;
  const scenario = SCENARIOS.find((s) => s.id === p.scenario);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showEn, setShowEn] = useState<Record<number, boolean>>({});
  const [openCorr, setOpenCorr] = useState<Record<number, boolean>>({});
  const [finished, setFinished] = useState(false);
  const [offline, setOffline] = useState(false);
  const started = useRef(Date.now());
  const scroller = useRef<any>(null);
  const rec = useGermanRecognizer();

  useEffect(() => {
    if (rec.transcript) setInput(rec.transcript);
  }, [rec.transcript]);

  const ask = async (history: ChatTurn[]) => {
    setBusy(true);
    const r = await tutorChat({ level, scenarioId: scenario?.id, topic: p.topic, history });
    setBusy(false);
    setOffline(!!r.offline);
    setSuggestions(r.suggestions ?? []);
    setMsgs((m) => {
      const copy = [...m];
      // attach corrections to the last user message (shown after the user finishes)
      for (let i = copy.length - 1; i >= 0; i--) if (copy[i].role === 'user') { copy[i] = { ...copy[i], corrections: r.corrections, natural: r.natural }; break; }
      return [...copy, { role: 'assistant', text: r.reply, en: r.replyEn }];
    });
    speak(r.reply);
    setTimeout(() => scroller.current?.scrollToEnd({ animated: true }), 100);
  };

  useEffect(() => {
    ask([]);
    return () => {
      stopSpeaking();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const send = async (text = input) => {
    const tx = text.trim();
    if (!tx || busy) return;
    if (rec.listening) rec.stop();
    setInput('');
    rec.setTranscript('');
    const next = [...msgs, { role: 'user' as const, text: tx }];
    setMsgs(next);
    await ask(next.map((m) => ({ role: m.role, content: m.text })));
  };

  const allCorrections = msgs.flatMap((m) => m.corrections ?? []);

  const finish = () => {
    const sec = Math.round((Date.now() - started.current) / 1000);
    const turns = msgs.filter((m) => m.role === 'user').length;
    const s = useStore.getState();
    s.logSpeaking(scenario?.id ?? p.topic ?? 'free', sec, turns);
    allCorrections.forEach((x) => {
      s.logMistake({ kind: 'speaking', tag: x.tag, wrong: x.wrong, right: x.right, explanation: x.explanation });
      if (x.tag) s.recordSkill(x.tag, false);
    });
    s.addXp(turns * 4);
    checkAchievements();
    stopSpeaking();
    setFinished(true);
  };

  const showInline = settings.feedbackMode === 'each';

  return (
    <StackScreen title={scenario ? scenario.titleDe : p.topic ? `Gespräch: ${p.topic}` : 'Freies Gespräch'} scroll={false} right={!finished ? <Button small kind="ghost" title="Finish" onPress={finish} /> : undefined}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
        <ScrollView ref={scroller} contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 20 }} onContentSizeChange={() => scroller.current?.scrollToEnd({ animated: true })}>
          <Card tone="alt" style={{ gap: 4 }}>
            <Row gap={6}><Pill text={level} />{offline ? <Pill text="offline teacher" color={c.accent} /> : <Pill text="AI teacher" color={c.success} />}</Row>
            <Txt variant="sub">{scenario ? `🎯 ${scenario.goal}` : 'Speak freely. I\'ll let you finish and give feedback without interrupting.'}</Txt>
          </Card>

          {msgs.map((m, i) => (
            <Animated.View key={i} entering={FadeInUp} style={{ alignItems: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 4 }}>
              <View style={{ maxWidth: '86%', padding: 12, borderRadius: 18, backgroundColor: m.role === 'user' ? c.primary : c.card, borderWidth: m.role === 'user' ? 0 : 0.5, borderColor: c.border }}>
                <Txt color={m.role === 'user' ? c.primaryText : c.text} selectable>{m.text}</Txt>
                {m.role === 'assistant' && showEn[i] && m.en ? <Txt variant="small" style={{ marginTop: 4 }}>{m.en}</Txt> : null}
              </View>
              {m.role === 'assistant' ? (
                <Row gap={6}>
                  <AudioButton text={m.text} size={16} />
                  {m.en ? <Chip label={showEn[i] ? 'Hide EN' : 'EN'} onPress={() => setShowEn({ ...showEn, [i]: !showEn[i] })} /> : null}
                </Row>
              ) : showInline && m.corrections?.length ? (
                <Pressable onPress={() => setOpenCorr({ ...openCorr, [i]: !openCorr[i] })}>
                  <Txt variant="small" color={c.accent}>✏️ {m.corrections.length} suggestion{m.corrections.length > 1 ? 's' : ''} {openCorr[i] ? '▲' : '▼'}</Txt>
                </Pressable>
              ) : showInline && m.corrections && !m.corrections.length ? (
                <Txt variant="small" color={c.success}>✓ looks good</Txt>
              ) : null}
              {showInline && openCorr[i] ? <Corrections list={m.corrections ?? []} natural={m.natural} /> : null}
            </Animated.View>
          ))}
          {busy ? <Txt variant="small">Lehrer tippt…</Txt> : null}

          {finished ? (
            <Card style={{ gap: 10 }}>
              <Txt variant="h2">Feedback</Txt>
              <Txt variant="sub">{msgs.filter((m) => m.role === 'user').length} turns · {Math.round((Date.now() - started.current) / 60000)} min</Txt>
              {allCorrections.length ? <Corrections list={allCorrections} /> : <Txt>No mistakes detected — sehr gut! 🎉</Txt>}
              {msgs.filter((m) => m.natural).map((m, i) => (
                <Txt key={i} variant="sub">💬 More natural: „{m.natural}“</Txt>
              ))}
              <Row>
                <Button title="Again" kind="secondary" style={{ flex: 1 }} onPress={() => router.replace({ pathname: '/chat', params: p })} />
                <Button title="Done" style={{ flex: 1 }} onPress={() => router.back()} />
              </Row>
            </Card>
          ) : null}
        </ScrollView>

        {!finished ? (
          <View style={{ padding: 12, gap: 8, borderTopWidth: 0.5, borderTopColor: c.border, backgroundColor: c.bg }}>
            {suggestions.length ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                {suggestions.map((s) => <Chip key={s} label={s} onPress={() => setInput(s)} />)}
              </ScrollView>
            ) : null}
            {rec.error ? <Txt variant="small" color={c.danger}>{rec.error}</Txt> : null}
            <Row>
              <Pressable
                onPress={() => (rec.listening ? rec.stop() : rec.start())}
                style={{ width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: rec.listening ? c.danger : c.cardAlt }}>
                <Icon name={rec.listening ? 'stop' : 'mic'} color={rec.listening ? '#fff' : c.primary} size={24} />
              </Pressable>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder={rec.listening ? 'Listening… tap ■ when finished' : 'Sprich oder schreib auf Deutsch…'}
                placeholderTextColor={c.faint}
                multiline
                style={{ flex: 1, minHeight: 48, maxHeight: 120, borderRadius: 16, paddingHorizontal: 14, paddingTop: 13, backgroundColor: c.card, color: c.text, fontSize: 16, borderWidth: 0.5, borderColor: c.border }}
              />
              <Pressable onPress={() => send()} disabled={!input.trim() || busy} style={{ width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: input.trim() ? c.primary : c.cardAlt }}>
                <Icon name="arrow-up" color={input.trim() ? c.primaryText : c.faint} />
              </Pressable>
            </Row>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </StackScreen>
  );
}

function Corrections({ list, natural }: { list: Correction[]; natural?: string }) {
  const c = useColors();
  return (
    <View style={{ gap: 8, alignSelf: 'stretch' }}>
      {list.map((x, i) => (
        <Card key={i} style={{ gap: 4, borderLeftWidth: 4, borderLeftColor: c.accent }}>
          <Txt><Txt color={c.danger} style={{ textDecorationLine: 'line-through' }}>{x.wrong}</Txt>  →  <Txt color={c.success} style={{ fontWeight: '700' }}>{x.right}</Txt></Txt>
          <Txt variant="sub">{x.explanation}</Txt>
        </Card>
      ))}
      {natural ? <Txt variant="sub">💬 More natural: „{natural}“</Txt> : null}
    </View>
  );
}
