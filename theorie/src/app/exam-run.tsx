import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuestionView } from '@/components/QuestionView';
import { Button, Card, IconButton, Row, Txt } from '@/components/ui';
import { Q_BY_ID } from '@/data/questions';
import { buildExam, isCorrect, scoreExam, useStore } from '@/lib/store';
import { useColors } from '@/lib/theme';

export default function ExamRun() {
  const p = useLocalSearchParams<{ seed?: string; label?: string }>();
  const c = useColors();
  const ids = useMemo(() => buildExam(p.seed ? Number(p.seed) : undefined), [p.seed]);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [confirm, setConfirm] = useState(false);
  const [sec, setSec] = useState(0);
  const start = useRef(Date.now());

  useEffect(() => {
    const t = setInterval(() => setSec(Math.round((Date.now() - start.current) / 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  const q = Q_BY_ID[ids[i]];
  const done = Object.values(answers).filter(Boolean).length;

  const submit = () => {
    const r = scoreExam(ids, answers);
    const id = Math.random().toString(36).slice(2);
    const st = useStore.getState();
    ids.forEach((qid) => st.answer(qid, isCorrect(Q_BY_ID[qid], answers[qid])));
    st.saveExam({ id, at: Date.now(), errorPoints: r.errorPoints, passed: r.passed, fivePtWrong: r.fivePtWrong, answers, questionIds: ids, label: p.label ?? 'Prüfungssimulation', seconds: sec });
    router.replace(`/result/${id}`);
  };

  const mm = String(Math.floor(sec / 60)).padStart(2, '0');
  const ss = String(sec % 60).padStart(2, '0');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <Row style={{ paddingHorizontal: 16, paddingVertical: 8, justifyContent: 'space-between' }}>
        <IconButton name="close" onPress={() => router.back()} />
        <View style={{ alignItems: 'center' }}>
          <Txt variant="label">{p.label ?? 'Prüfung'}</Txt>
          <Txt variant="h3">Frage {i + 1}/30 · ⏱ {mm}:{ss}</Txt>
        </View>
        <Button small title="Abgeben" onPress={() => setConfirm(true)} />
      </Row>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 6, paddingBottom: 8 }} style={{ flexGrow: 0 }}>
        {ids.map((qid, k) => (
          <Pressable key={qid} onPress={() => setI(k)} style={{ width: 34, height: 34, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: k === i ? c.primary : answers[qid] ? c.primary + '33' : c.cardAlt, borderWidth: useStore.getState().q[qid]?.marked ? 2 : 0, borderColor: c.accent }}>
            <Txt variant="small" color={k === i ? c.primaryText : c.text} style={{ fontWeight: '700' }}>{k + 1}</Txt>
          </Pressable>
        ))}
      </ScrollView>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {confirm ? (
          <Card style={{ gap: 10 }}>
            <Txt variant="h2">Prüfung abgeben?</Txt>
            <Txt variant="sub">{done} von 30 Fragen beantwortet.{done < 30 ? ' Unbeantwortete Fragen zählen als falsch.' : ''}</Txt>
            <Row>
              <Button title="Weiter bearbeiten" kind="secondary" style={{ flex: 1 }} onPress={() => setConfirm(false)} />
              <Button title="Abgeben" style={{ flex: 1 }} onPress={submit} />
            </Row>
          </Card>
        ) : null}
        <Card>
          <QuestionView key={q.id} q={q} mode="exam" value={answers[q.id]} onChange={(v) => setAnswers({ ...answers, [q.id]: v })} />
        </Card>
        <Row>
          <Button title="← Zurück" kind="ghost" style={{ flex: 1 }} disabled={i === 0} onPress={() => setI(i - 1)} />
          {i < 29 ? <Button title="Weiter →" style={{ flex: 1 }} onPress={() => setI(i + 1)} /> : <Button title="Abgeben" style={{ flex: 1 }} onPress={() => setConfirm(true)} />}
        </Row>
      </ScrollView>
    </SafeAreaView>
  );
}
