import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { ExerciseView } from '@/components/Exercise';
import { AudioButton, Button, Card, Icon, Progress, Row, StackScreen, Txt, fail, success } from '@/components/ui';
import { GRAMMAR } from '@/data/grammar';
import { LEVELS, type Exercise, type Word } from '@/data/types';
import { displayWord, VOCAB, WORDS_BY_ID } from '@/data/vocab';
import { candidatePool, checkAchievements, shuffle } from '@/lib/learning';
import { speak } from '@/lib/speech';
import { useStore } from '@/lib/store';
import { genderColor, useColors } from '@/lib/theme';

const TITLES: Record<string, string> = {
  daily: 'Daily Quiz', match: 'Word Matching', article: 'Article Challenge', builder: 'Sentence Builder', fill: 'Fill in the Blanks',
  listening: 'Listening Challenge', speed: 'Speed Vocabulary', battle: 'Grammar Battle', memory: 'Memory Challenge',
};

/** Words to play with: learned words first, topped up from the level pool */
function gamePool(min = 12, source?: string): Word[] {
  const s = useStore.getState();
  if (source === 'saved' && s.favorites.length >= 4) return s.favorites.map((id) => WORDS_BY_ID[id]).filter(Boolean);
  const learned = Object.keys(s.cards).map((id) => WORDS_BY_ID[id]).filter(Boolean);
  const pool = [...learned];
  for (const w of candidatePool(s.settings.level)) {
    if (pool.length >= Math.max(min, learned.length)) break;
    if (!pool.includes(w)) pool.push(w);
  }
  return pool;
}

const distractors = (w: Word, pool: Word[], n = 3) => shuffle(pool.filter((x) => x.id !== w.id && x.pos === w.pos)).concat(shuffle(pool.filter((x) => x.id !== w.id && x.pos !== w.pos))).slice(0, n);

function recordWord(id: string, ok: boolean) {
  const s = useStore.getState();
  if (s.cards[id]) s.grade(id, ok ? 2 : 0);
  if (!ok) {
    const w = WORDS_BY_ID[id];
    s.logMistake({ kind: 'vocab', wrong: `${displayWord(w)} ≠ ?`, right: `${displayWord(w)} = ${w.en}`, explanation: w.usage });
  }
}

export default function Game() {
  const { type, tag, source } = useLocalSearchParams<{ type: string; tag?: string; source?: string }>();
  const [round, setRound] = useState(0);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);

  const done = (score: number, total: number) => {
    const s = useStore.getState();
    s.finishQuiz(type!, score, total);
    const xp = score * 4 + (type === 'daily' && score >= 8 ? 50 : 0);
    s.addXp(xp);
    checkAchievements();
    setResult({ score, total });
  };

  const key = `${type}-${round}`;
  const games: Record<string, React.ReactNode> = {
    match: <MatchGame key={key} onDone={done} source={source} />,
    article: <ArticleGame key={key} onDone={done} />,
    builder: <BuilderGame key={key} onDone={done} />,
    fill: <FillGame key={key} onDone={done} />,
    listening: <ListeningGame key={key} onDone={done} />,
    speed: <SpeedGame key={key} onDone={done} />,
    battle: <BattleGame key={key} onDone={done} tag={tag} />,
    daily: <DailyQuiz key={key} onDone={done} />,
    memory: <MemoryGame key={key} onDone={done} />,
  };

  return (
    <StackScreen title={TITLES[type ?? ''] ?? 'Game'}>
      {result ? (
        <Animated.View entering={ZoomIn} style={{ alignItems: 'center', gap: 12, paddingTop: 20 }}>
          <Txt variant="big">{result.score / Math.max(1, result.total) >= 0.8 ? '🏆' : result.score / Math.max(1, result.total) >= 0.5 ? '⭐️' : '💪'}</Txt>
          <Txt variant="h1">{result.score}{result.total ? ` / ${result.total}` : ''}</Txt>
          <Txt variant="sub">+{result.score * 4 + (type === 'daily' && result.score >= 8 ? 50 : 0)} XP · results feed your review schedule</Txt>
          <Row>
            <Button title="Play again" icon="refresh" onPress={() => { setResult(null); setRound(round + 1); }} />
            <Button title="Back" kind="secondary" onPress={() => router.back()} />
          </Row>
        </Animated.View>
      ) : (
        games[type ?? ''] ?? <Txt>Unknown game</Txt>
      )}
    </StackScreen>
  );
}

type Done = { onDone: (score: number, total: number) => void };

// ── Option button ───────────────────────────────────────────
function Opt({ label, state, onPress, sub }: { label: string; sub?: string; state?: 'right' | 'wrong' | 'idle'; onPress: () => void }) {
  const c = useColors();
  const border = state === 'right' ? c.success : state === 'wrong' ? c.danger : c.border;
  return (
    <Pressable onPress={onPress} disabled={state !== undefined && state !== 'idle'} style={({ pressed }) => ({ padding: 15, borderRadius: 14, borderWidth: 1.5, borderColor: border, backgroundColor: state === 'right' ? c.success + '18' : state === 'wrong' ? c.danger + '18' : c.card, opacity: pressed ? 0.8 : 1 })}>
      <Txt style={{ fontWeight: '600' }}>{label}</Txt>
      {sub ? <Txt variant="small">{sub}</Txt> : null}
    </Pressable>
  );
}

/** Generic multiple-choice runner */
function MCRunner({ questions, onDone, timed }: Done & { timed?: number; questions: { prompt: React.ReactNode; options: string[]; answer: number; wordId?: string; tag?: string; onShow?: () => void }[] }) {
  const c = useColors();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(timed ?? 0);
  const scoreRef = useRef(0);

  useEffect(() => {
    if (!timed) return;
    const t = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(t);
  }, [timed]);
  useEffect(() => {
    if (timed && left <= 0) onDone(scoreRef.current, 0);
  }, [left]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    questions[i]?.onShow?.();
  }, [i]); // eslint-disable-line react-hooks/exhaustive-deps

  const q = questions[i];
  if (!q) return null;
  const choose = (k: number) => {
    setPicked(k);
    const ok = k === q.answer;
    ok ? success() : fail();
    if (q.wordId) recordWord(q.wordId, ok);
    if (q.tag) useStore.getState().recordSkill(q.tag, ok);
    const ns = score + (ok ? 1 : 0);
    scoreRef.current = ns;
    setScore(ns);
    setTimeout(() => {
      setPicked(null);
      if (i + 1 >= questions.length) onDone(ns, timed ? 0 : questions.length);
      else setI(i + 1);
    }, timed ? 350 : ok ? 650 : 1300);
  };

  return (
    <View style={{ gap: 14 }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Txt variant="small">{timed ? `⏱ ${left}s` : `${i + 1}/${questions.length}`}</Txt>
        <Txt variant="h3" color={c.success}>{score} ✓</Txt>
      </Row>
      <Progress value={timed ? left / timed : i / questions.length} color={timed && left < 10 ? c.danger : undefined} />
      <Animated.View key={i} entering={FadeIn.duration(200)}>
        <Card style={{ minHeight: 130, alignItems: 'center', justifyContent: 'center', gap: 8 }}>{q.prompt}</Card>
      </Animated.View>
      {q.options.map((o, k) => (
        <Opt key={o + k} label={o} onPress={() => choose(k)} state={picked === null ? 'idle' : k === q.answer ? 'right' : k === picked ? 'wrong' : 'idle'} />
      ))}
    </View>
  );
}

function vocabMC(words: Word[], pool: Word[], dir: 'de-en' | 'en-de' = 'de-en') {
  return words.map((w) => {
    const opts = shuffle([w, ...distractors(w, pool)]);
    return {
      prompt: dir === 'de-en' ? (
        <>
          <Txt variant="big" style={{ textAlign: 'center' }}>{displayWord(w)}</Txt>
          <Txt variant="small">{w.pos}</Txt>
        </>
      ) : (
        <Txt variant="big" style={{ textAlign: 'center' }}>{w.en}</Txt>
      ),
      options: opts.map((o) => (dir === 'de-en' ? o.en : displayWord(o))),
      answer: opts.indexOf(w),
      wordId: w.id,
    };
  });
}

// ── Speed Vocabulary ────────────────────────────────────────
function SpeedGame({ onDone }: Done) {
  const qs = useMemo(() => {
    const pool = gamePool(20);
    const words = shuffle([...pool, ...pool, ...pool]).slice(0, 60);
    // alternate directions: German → English and English → German
    return words.flatMap((w, i) => vocabMC([w], pool, i % 2 ? 'en-de' : 'de-en'));
  }, []);
  return <MCRunner questions={qs} onDone={onDone} timed={60} />;
}

// ── Article Challenge ───────────────────────────────────────
function ArticleGame({ onDone }: Done) {
  const c = useColors();
  const nouns = useMemo(() => {
    const lv = LEVELS.indexOf(useStore.getState().settings.level);
    return shuffle(VOCAB.filter((w) => w.pos === 'noun' && LEVELS.indexOf(w.level) <= Math.max(1, lv))).slice(0, 12);
  }, []);
  const qs = nouns.map((w) => ({
    prompt: (
      <>
        <Txt variant="big">{w.de}</Txt>
        <Txt variant="small">{w.en}</Txt>
      </>
    ),
    options: ['der', 'die', 'das'],
    answer: ['der', 'die', 'das'].indexOf(w.gender!),
    wordId: w.id,
    tag: 'artikel',
  }));
  return (
    <View style={{ gap: 10 }}>
      <Row gap={14} style={{ justifyContent: 'center' }}>
        <Txt color={c.der}>● der</Txt><Txt color={c.die}>● die</Txt><Txt color={c.das}>● das</Txt>
      </Row>
      <MCRunner questions={qs} onDone={onDone} />
    </View>
  );
}

// ── Listening Challenge ─────────────────────────────────────
function ListeningGame({ onDone }: Done) {
  const qs = useMemo(() => {
    const pool = gamePool(16);
    return shuffle(pool).slice(0, 10).map((w) => {
      const opts = shuffle([w, ...distractors(w, pool)]);
      return {
        prompt: (
          <View style={{ alignItems: 'center', gap: 8 }}>
            <Icon name="headset" size={40} />
            <Row>
              <AudioButton text={displayWord(w)} size={26} />
              <AudioButton text={displayWord(w)} size={20} rate={0.5} />
            </Row>
            <Txt variant="small">Tap to replay · slow</Txt>
          </View>
        ),
        options: opts.map((o) => `${displayWord(o)} — ${o.en}`),
        answer: opts.indexOf(w),
        wordId: w.id,
        onShow: () => speak(displayWord(w)),
      };
    });
  }, []);
  return <MCRunner questions={qs} onDone={onDone} />;
}

// ── Fill in the blanks ──────────────────────────────────────
function FillGame({ onDone }: Done) {
  const qs = useMemo(() => {
    const pool = gamePool(16);
    const items: { w: Word; sentence: string; en: string; form: string }[] = [];
    for (const w of shuffle(pool)) {
      const forms = [w.de, w.plural?.replace(/^die /, ''), ...(w.verb ? Object.values(w.verb).flatMap((v) => v.split(' ')) : [])].filter(Boolean) as string[];
      for (const [de, en] of w.examples) {
        const tok = de.split(/\s+/).find((t) => forms.some((f) => t.replace(/[.,!?„“]/g, '').toLowerCase() === f.toLowerCase() && f.length > 2));
        if (tok) {
          items.push({ w, sentence: de, en, form: tok.replace(/[.,!?„“]/g, '') });
          break;
        }
      }
      if (items.length >= 10) break;
    }
    return items.map(({ w, sentence, en, form }) => {
      const opts = shuffle([w, ...distractors(w, pool)]);
      return {
        prompt: (
          <>
            <Txt variant="h2" style={{ textAlign: 'center' }}>{sentence.replace(form, '_____')}</Txt>
            <Txt variant="small" style={{ textAlign: 'center' }}>{en}</Txt>
          </>
        ),
        options: opts.map((o) => (o.id === w.id ? form : o.de)),
        answer: opts.indexOf(w),
        wordId: w.id,
      };
    });
  }, []);
  return <MCRunner questions={qs} onDone={onDone} />;
}

// ── Sentence Builder ────────────────────────────────────────
function BuilderGame({ onDone }: Done) {
  const exercises = useMemo<Exercise[]>(() => {
    const fromGrammar = GRAMMAR.flatMap((g) => g.exercises.filter((e) => e.type === 'order'));
    const fromVocab: Exercise[] = gamePool(14)
      .flatMap((w) => w.examples.slice(0, 1))
      .filter(([de]) => de.split(' ').length <= 8 && !/[„“:]/.test(de))
      .map(([de, en]) => {
        const clean = de.replace(/[.!?]$/, '');
        return { type: 'order', words: clean.split(' '), answer: clean, en, explain: `Correct order: ${de}` } as Exercise;
      });
    return shuffle([...fromGrammar, ...fromVocab]).slice(0, 6);
  }, []);
  return <ExerciseSeq exercises={exercises} onDone={onDone} tag="wortstellung" />;
}

function ExerciseSeq({ exercises, onDone, tag }: Done & { exercises: (Exercise & { tag?: string })[]; tag?: string }) {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const s = useStore.getState();
  return (
    <View style={{ gap: 14 }}>
      <Progress value={i / exercises.length} />
      <Card>
        <ExerciseView
          key={i}
          ex={exercises[i]}
          onDone={(ok, given) => {
            const ex = exercises[i];
            s.recordSkill(ex.tag ?? tag ?? 'wortstellung', ok);
            if (!ok) s.logMistake({ kind: 'grammar', tag: ex.tag ?? tag, wrong: given, right: ex.type === 'order' ? ex.answer.split('|')[0] : ex.type === 'mc' ? ex.options[ex.answer] : ex.answer[0], explanation: ex.explain });
            const ns = score + (ok ? 1 : 0);
            setScore(ns);
            if (i + 1 >= exercises.length) onDone(ns, exercises.length);
            else setI(i + 1);
          }}
        />
      </Card>
    </View>
  );
}

// ── Grammar Battle ──────────────────────────────────────────
function BattleGame({ onDone, tag }: Done & { tag?: string }) {
  const c = useColors();
  const deck = useMemo(() => {
    const lv = LEVELS.indexOf(useStore.getState().settings.level);
    const lessons = GRAMMAR.filter((g) => (tag ? g.tag === tag : LEVELS.indexOf(g.level) <= Math.max(lv, 1)));
    const all = lessons.flatMap((g) => g.exercises.map((e) => ({ ...e, tag: g.tag })));
    return shuffle(tag ? [...all, ...all] : all);
  }, [tag]);
  const [i, setI] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const ex = deck[i % deck.length];

  return (
    <View style={{ gap: 14 }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Txt variant="h2">{'❤️'.repeat(lives)}{'🖤'.repeat(3 - lives)}</Txt>
        <Txt variant="h2" color={c.accent}>{score} pts{combo >= 3 ? ` · 🔥x${combo}` : ''}</Txt>
      </Row>
      <Card>
        <ExerciseView
          key={i}
          ex={ex}
          onDone={(ok, given) => {
            const s = useStore.getState();
            s.recordSkill(ex.tag, ok);
            if (!ok) s.logMistake({ kind: 'grammar', tag: ex.tag, wrong: given, right: ex.type === 'order' ? ex.answer.split('|')[0] : ex.type === 'mc' ? ex.options[ex.answer] : ex.answer[0], explanation: ex.explain });
            const nl = ok ? lives : lives - 1;
            const nc = ok ? combo + 1 : 0;
            const ns = score + (ok ? 1 + Math.floor(nc / 3) : 0);
            setLives(nl);
            setCombo(nc);
            setScore(ns);
            if (nl <= 0 || i + 1 >= 30) onDone(ns, 0);
            else setI(i + 1);
          }}
        />
      </Card>
    </View>
  );
}

// ── Daily Quiz ──────────────────────────────────────────────
function DailyQuiz({ onDone }: Done) {
  const qs = useMemo(() => {
    const s = useStore.getState();
    const start = new Date().setHours(0, 0, 0, 0);
    const todays = Object.values(s.cards).filter((c) => c.introducedAt >= start || (c.lastReviewed ?? 0) >= start).map((c) => WORDS_BY_ID[c.wordId]).filter(Boolean);
    const pool = gamePool(16);
    const words = shuffle(todays.length >= 4 ? todays : pool).slice(0, 7);
    const vocabQs = vocabMC(words.slice(0, 4), pool, 'de-en').concat(vocabMC(words.slice(4), pool, 'en-de'));
    const lessonsToday = Object.entries(s.grammarDone).filter(([, v]) => v.at >= start).map(([id]) => id);
    const lv = LEVELS.indexOf(s.settings.level);
    const grammarPool = GRAMMAR.filter((g) => lessonsToday.includes(g.id) || LEVELS.indexOf(g.level) <= lv)
      .flatMap((g) => g.exercises.filter((e) => e.type === 'mc').map((e) => ({ ...e, tag: g.tag })));
    const gQs = shuffle(grammarPool).slice(0, 10 - vocabQs.length).map((e) => {
      const ex = e as Extract<Exercise, { type: 'mc' }> & { tag: string };
      return { prompt: <Txt variant="h2" style={{ textAlign: 'center' }}>{ex.q}</Txt>, options: ex.options, answer: ex.answer, tag: ex.tag };
    });
    return shuffle([...vocabQs, ...gQs]);
  }, []);
  return <MCRunner questions={qs} onDone={onDone} />;
}

// ── Word Matching ───────────────────────────────────────────
function MatchGame({ onDone, source }: Done & { source?: string }) {
  const c = useColors();
  const rounds = useMemo(() => {
    const pool = shuffle(gamePool(15, source));
    return [pool.slice(0, 5), pool.slice(5, 10), pool.slice(10, 15)].filter((r) => r.length >= 3);
  }, [source]);
  const [r, setR] = useState(0);
  const [left, setLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [errors, setErrors] = useState(0);
  const words = rounds[r] ?? [];
  const right = useMemo(() => shuffle(words), [r]); // eslint-disable-line react-hooks/exhaustive-deps
  const total = rounds.reduce((a, b) => a + b.length, 0);

  const pickRight = (id: string) => {
    if (!left) return;
    if (id === left) {
      success();
      recordWord(id, true);
      const m = [...matched, id];
      setMatched(m);
      setLeft(null);
      if (words.every((w) => m.includes(w.id))) {
        setTimeout(() => {
          if (r + 1 >= rounds.length) onDone(Math.max(0, total - errors), total);
          else { setR(r + 1); setMatched([]); }
        }, 400);
      }
    } else {
      fail();
      recordWord(left, false);
      setErrors(errors + 1);
      setWrong(id);
      setTimeout(() => setWrong(null), 500);
    }
  };

  const tile = (label: string, active: boolean, done: boolean, bad: boolean, onPress: () => void, color?: string) => (
    <Pressable onPress={onPress} disabled={done} style={{ padding: 14, borderRadius: 14, minHeight: 56, justifyContent: 'center', borderWidth: 1.5, borderColor: bad ? c.danger : active ? c.primary : c.border, backgroundColor: done ? c.success + '22' : c.card, opacity: done ? 0.5 : 1 }}>
      <Txt style={{ fontWeight: '600' }} color={color}>{label}</Txt>
    </Pressable>
  );

  return (
    <View style={{ gap: 12 }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Txt variant="small">Round {r + 1}/{rounds.length}</Txt>
        <Txt variant="small">Mistakes: {errors}</Txt>
      </Row>
      <Row style={{ alignItems: 'flex-start' }}>
        <View style={{ flex: 1, gap: 8 }}>
          {words.map((w) => tile(displayWord(w), left === w.id, matched.includes(w.id), false, () => { setLeft(w.id); speak(displayWord(w)); }, genderColor(c, w.gender)))}
        </View>
        <View style={{ flex: 1, gap: 8 }}>
          {right.map((w) => tile(w.en, false, matched.includes(w.id), wrong === w.id, () => pickRight(w.id)))}
        </View>
      </Row>
    </View>
  );
}

// ── Memory Challenge ────────────────────────────────────────
function MemoryGame({ onDone }: Done) {
  const c = useColors();
  const cards = useMemo(() => {
    const words = shuffle(gamePool(6)).slice(0, 6);
    return shuffle(words.flatMap((w) => [{ key: w.id + 'de', id: w.id, label: displayWord(w) }, { key: w.id + 'en', id: w.id, label: w.en }]));
  }, []);
  const [open, setOpen] = useState<string[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);

  const flip = (k: string) => {
    if (open.length === 2 || open.includes(k)) return;
    const next = [...open, k];
    setOpen(next);
    const card = cards.find((x) => x.key === k)!;
    if (k.endsWith('de')) speak(card.label);
    if (next.length === 2) {
      setMoves(moves + 1);
      const [a, b] = next.map((x) => cards.find((y) => y.key === x)!);
      if (a.id === b.id) {
        success();
        const f = [...found, a.id];
        setFound(f);
        setOpen([]);
        if (f.length === cards.length / 2) setTimeout(() => onDone(Math.max(1, 12 - Math.max(0, moves + 1 - 6)), 12), 500);
      } else setTimeout(() => setOpen([]), 900);
    }
  };

  return (
    <View style={{ gap: 12 }}>
      <Txt variant="small">Moves: {moves} · Pairs: {found.length}/6</Txt>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {cards.map((x) => {
          const shown = open.includes(x.key) || found.includes(x.id);
          return (
            <Pressable key={x.key} onPress={() => flip(x.key)} style={{ width: '31%', aspectRatio: 1, borderRadius: 14, alignItems: 'center', justifyContent: 'center', padding: 6, backgroundColor: found.includes(x.id) ? c.success + '33' : shown ? c.card : c.primary, borderWidth: 0.5, borderColor: c.border }}>
              {shown ? <Txt style={{ textAlign: 'center', fontWeight: '700', fontSize: 13.5 }}>{x.label}</Txt> : <Txt variant="h1" color={c.primaryText}>?</Txt>}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
