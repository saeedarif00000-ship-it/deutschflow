import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { SIGNS, Sign } from '@/components/Sign';
import { AudioButton, Button, Card, Chip, Row, Screen, Txt } from '@/components/ui';
import { useStore } from '@/lib/store';
import { useColors } from '@/lib/theme';

const GROUPS = [
  { id: 'Gefahr', de: 'Gefahrzeichen', en: 'Warning signs' },
  { id: 'Vorschrift', de: 'Vorschriftzeichen', en: 'Regulatory signs' },
  { id: 'Richtung', de: 'Richtzeichen', en: 'Informative signs' },
] as const;

export default function Signs() {
  const c = useColors();
  const lang = useStore((s) => s.settings.lang);
  const [g, setG] = useState<(typeof GROUPS)[number]['id']>('Gefahr');
  const [open, setOpen] = useState<string | null>(null);
  const list = SIGNS.filter((s) => s.group === g);
  return (
    <Screen title="Verkehrszeichen">
      <Button title="Zeichen-Quiz starten" icon="images" onPress={() => router.push('/topic/zeichen')} />
      <Row gap={6} style={{ flexWrap: 'wrap' }}>
        {GROUPS.map((x) => <Chip key={x.id} label={`${x.de}`} active={g === x.id} onPress={() => setG(x.id)} />)}
      </Row>
      <Txt variant="small">Zeichnungen vereinfacht nach den amtlichen StVO-Zeichen · simplified drawings of the official signs</Txt>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {list.map((s) => (
          <Pressable key={s.id + s.de} onPress={() => setOpen(open === s.id ? null : s.id)} style={{ width: open === s.id ? '100%' : '47%', flexGrow: 1 }}>
            <Card style={{ alignItems: 'center', gap: 6 }}>
              <Sign id={s.id} size={open === s.id ? 140 : 84} />
              <Txt variant="small">Zeichen {s.nr}</Txt>
              {lang !== 'en' ? <Txt style={{ fontWeight: '700', textAlign: 'center' }}>{s.de}</Txt> : null}
              {lang !== 'de' ? <Txt variant="small" style={{ textAlign: 'center' }}>{s.en}</Txt> : null}
              {open === s.id ? (
                <View style={{ gap: 6, alignSelf: 'stretch' }}>
                  <Txt variant="sub">{s.meaning}</Txt>
                  <Row style={{ justifyContent: 'center' }}><AudioButton text={s.de} /></Row>
                </View>
              ) : null}
            </Card>
          </Pressable>
        ))}
      </View>
      <View style={{ height: 1, backgroundColor: c.border }} />
    </Screen>
  );
}
