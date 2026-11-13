import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { Sign } from '@/components/Sign';
import { AudioButton, Button, Card, Chip, Input, Row, Screen, Txt } from '@/components/ui';
import { GROUPS, SYMBOLS, type SymbolGroup } from '@/data/symbols';
import { useStore } from '@/lib/store';
import { useColors } from '@/lib/theme';

export default function Signs() {
  const c = useColors();
  const lang = useStore((s) => s.settings.lang);
  const [g, setG] = useState<SymbolGroup>('Gefahr');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const needle = q.trim().toLowerCase();
  const list = needle
    ? SYMBOLS.filter((s) => (s.de + ' ' + s.en + ' ' + s.nr + ' ' + s.meaning).toLowerCase().includes(needle))
    : SYMBOLS.filter((s) => s.group === g);
  const group = GROUPS.find((x) => x.id === g)!;
  const nr = (n: string) => (/^\d/.test(n) ? `Zeichen ${n}` : n === 'ZZ' ? 'Zusatzzeichen' : n === '—' ? '' : n);
  return (
    <Screen title="Zeichen & Symbole">
      <Txt variant="sub">{SYMBOLS.length} Zeichen, Markierungen, Lichtzeichen und Kontrollleuchten – jeweils mit Erklärung und Quiz.</Txt>
      <Input value={q} onChangeText={setQ} placeholder="Suchen … (z. B. 306, Parken, Ampel)" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
        {GROUPS.map((x) => (
          <Chip key={x.id} label={`${x.de} (${SYMBOLS.filter((s) => s.group === x.id).length})`} active={!needle && g === x.id} onPress={() => { setQ(''); setG(x.id); }} />
        ))}
      </ScrollView>
      {!needle ? (
        <Card style={{ gap: 8 }}>
          <Txt style={{ fontWeight: '700' }}>{group.de} · {group.en}</Txt>
          <Txt variant="sub">{group.info}</Txt>
          <Button title={`Quiz: ${group.de}`} icon="images" onPress={() => router.push(`/topic/grp-${g}`)} />
        </Card>
      ) : null}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {list.map((s) => {
          const isOpen = open === s.id;
          return (
            <Pressable key={s.id} onPress={() => setOpen(isOpen ? null : s.id)} style={{ width: isOpen ? '100%' : '47%', flexGrow: 1 }}>
              <Card style={{ alignItems: 'center', gap: 6 }}>
                <Sign id={s.id} size={isOpen ? 140 : 84} />
                {nr(s.nr) ? <Txt variant="small">{nr(s.nr)}</Txt> : null}
                {lang !== 'en' ? <Txt style={{ fontWeight: '700', textAlign: 'center' }}>{s.de}</Txt> : null}
                {lang !== 'de' ? <Txt variant="small" style={{ textAlign: 'center' }}>{s.en}</Txt> : null}
                {isOpen ? (
                  <View style={{ gap: 8, alignSelf: 'stretch' }}>
                    {lang !== 'en' ? <Txt>{s.meaning}</Txt> : null}
                    {lang !== 'de' ? <Txt variant="sub">{s.meaningEn}</Txt> : null}
                    {s.tip ? (
                      <View style={{ backgroundColor: c.cardAlt, borderRadius: 10, padding: 10 }}>
                        <Txt variant="small" style={{ fontWeight: '700' }}>Prüfungstipp</Txt>
                        <Txt variant="sub">{s.tip}</Txt>
                      </View>
                    ) : null}
                    <Row style={{ justifyContent: 'center' }}><AudioButton text={`${s.de}. ${s.meaning}`} /></Row>
                  </View>
                ) : null}
              </Card>
            </Pressable>
          );
        })}
      </View>
      <Txt variant="small">Vereinfachte Zeichnungen nach den StVO-Zeichen · simplified drawings, not the official artwork</Txt>
    </Screen>
  );
}
