import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { speak } from '@/lib/speech';
import { radius, useColors } from '@/lib/theme';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];
export const Icon = ({ name, size = 20, color }: { name: IconName | string; size?: number; color?: string }) => {
  const c = useColors();
  return <Ionicons name={name as IconName} size={size} color={color ?? c.text} />;
};

export const tap = () => {
  if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
};
export const success = () => {
  if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
};
export const fail = () => {
  if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
};

export function Screen({
  children,
  title,
  scroll = true,
  edges,
  headerRight,
  contentStyle,
}: {
  children: React.ReactNode;
  title?: string;
  scroll?: boolean;
  edges?: ('top' | 'bottom')[];
  headerRight?: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const c = useColors();
  const body = scroll ? (
    <ScrollView contentContainerStyle={[styles.content, contentStyle]} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  ) : (
    <View style={[{ flex: 1 }, contentStyle]}>{children}</View>
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={edges ?? ['top']}>
      {title !== undefined && (
        <View style={styles.header}>
          <Txt variant="h1">{title}</Txt>
          {headerRight}
        </View>
      )}
      {body}
    </SafeAreaView>
  );
}

/** For pushed (stack) screens */
export function StackScreen({ title, children, scroll = true, right }: { title: string; children: React.ReactNode; scroll?: boolean; right?: React.ReactNode }) {
  const c = useColors();
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Stack.Screen options={{ title, headerRight: right ? () => right : undefined }} />
      {scroll ? (
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 60 }]} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </View>
  );
}

type Variant = 'h1' | 'h2' | 'h3' | 'body' | 'sub' | 'small' | 'label' | 'big';
export function Txt({ children, variant = 'body', color, style, numberOfLines, selectable }: { children: React.ReactNode; variant?: Variant; color?: string; style?: StyleProp<TextStyle>; numberOfLines?: number; selectable?: boolean }) {
  const c = useColors();
  const v: Record<Variant, TextStyle> = {
    big: { fontSize: 38, fontWeight: '800', letterSpacing: -1, color: c.text },
    h1: { fontSize: 28, fontWeight: '800', letterSpacing: -0.6, color: c.text },
    h2: { fontSize: 20, fontWeight: '700', letterSpacing: -0.3, color: c.text },
    h3: { fontSize: 16, fontWeight: '700', color: c.text },
    body: { fontSize: 15.5, lineHeight: 22, color: c.text },
    sub: { fontSize: 14, lineHeight: 20, color: c.sub },
    small: { fontSize: 12.5, color: c.sub },
    label: { fontSize: 11.5, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: c.faint },
  };
  return (
    <Text selectable={selectable} numberOfLines={numberOfLines} style={[v[variant], color ? { color } : null, style]}>
      {children}
    </Text>
  );
}

export function Card({ children, style, onPress, tone }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; tone?: 'alt' | 'primary' }) {
  const c = useColors();
  const bg = tone === 'alt' ? c.cardAlt : tone === 'primary' ? c.primary : c.card;
  const inner = <View style={[styles.card, { backgroundColor: bg, borderColor: tone ? 'transparent' : c.border }, style]}>{children}</View>;
  if (!onPress) return inner;
  return (
    <Pressable onPress={() => { tap(); onPress(); }} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] })}>
      {inner}
    </Pressable>
  );
}

export function Button({ title, onPress, kind = 'primary', icon, disabled, loading, style, small }: { title: string; onPress?: () => void; kind?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'; icon?: IconName | string; disabled?: boolean; loading?: boolean; style?: StyleProp<ViewStyle>; small?: boolean } & Omit<PressableProps, 'style'>) {
  const c = useColors();
  const bg = { primary: c.primary, secondary: c.cardAlt, ghost: 'transparent', danger: c.danger, success: c.success }[kind];
  const fg = kind === 'primary' ? c.primaryText : kind === 'secondary' || kind === 'ghost' ? c.text : '#fff';
  return (
    <Pressable
      disabled={disabled || loading}
      onPress={() => { tap(); onPress?.(); }}
      style={({ pressed }) => [styles.btn, small && styles.btnSmall, { backgroundColor: bg, opacity: disabled ? 0.45 : pressed ? 0.8 : 1 }, kind === 'ghost' && { borderWidth: 1, borderColor: c.border }, style]}>
      {loading ? <ActivityIndicator color={fg} /> : icon ? <Icon name={icon} size={small ? 16 : 18} color={fg} /> : null}
      <Text style={{ color: fg, fontWeight: '700', fontSize: small ? 13.5 : 15.5 }}>{title}</Text>
    </Pressable>
  );
}

export function IconButton({ name, onPress, color, size = 22, bg }: { name: IconName | string; onPress: () => void; color?: string; size?: number; bg?: string }) {
  const c = useColors();
  return (
    <Pressable hitSlop={10} onPress={() => { tap(); onPress(); }} style={({ pressed }) => [styles.iconBtn, { backgroundColor: bg ?? c.cardAlt, opacity: pressed ? 0.7 : 1 }]}>
      <Icon name={name} size={size} color={color ?? c.text} />
    </Pressable>
  );
}

export function AudioButton({ text, size = 20, rate }: { text: string; size?: number; rate?: number }) {
  const c = useColors();
  const [playing, setPlaying] = useState(false);
  return (
    <IconButton
      name={playing ? 'volume-high' : 'volume-medium-outline'}
      color={c.primary}
      size={size}
      onPress={() => {
        setPlaying(true);
        speak(text, { rate, onDone: () => setPlaying(false) });
        setTimeout(() => setPlaying(false), 4000);
      }}
    />
  );
}

export function Chip({ label, active, onPress, color }: { label: string; active?: boolean; onPress?: () => void; color?: string }) {
  const c = useColors();
  const col = color ?? c.primary;
  return (
    <Pressable onPress={() => { tap(); onPress?.(); }} style={[styles.chip, { backgroundColor: active ? col : c.cardAlt, borderColor: active ? col : c.border }]}>
      <Text style={{ color: active ? (color ? '#fff' : c.primaryText) : c.text, fontWeight: '600', fontSize: 13 }}>{label}</Text>
    </Pressable>
  );
}

export function Progress({ value, color, height = 8 }: { value: number; color?: string; height?: number }) {
  const c = useColors();
  return (
    <View style={{ height, borderRadius: height, backgroundColor: c.cardAlt, overflow: 'hidden' }}>
      <View style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, height: '100%', backgroundColor: color ?? c.primary, borderRadius: height }} />
    </View>
  );
}

export function Section({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Txt variant="label">{title}</Txt>
        {right}
      </View>
      {children}
    </View>
  );
}

export function Stat({ label, value, icon, color }: { label: string; value: string | number; icon: IconName | string; color?: string }) {
  const c = useColors();
  return (
    <Card style={{ flex: 1, padding: 14, gap: 6 }}>
      <Icon name={icon} size={18} color={color ?? c.primary} />
      <Txt variant="h2">{value}</Txt>
      <Txt variant="small">{label}</Txt>
    </Card>
  );
}

export function Row({ children, gap = 10, style }: { children: React.ReactNode; gap?: number; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap }, style]}>{children}</View>;
}

export function Input(props: React.ComponentProps<typeof TextInput>) {
  const c = useColors();
  return (
    <TextInput
      placeholderTextColor={c.faint}
      autoCapitalize="none"
      {...props}
      style={[styles.input, { backgroundColor: c.card, borderColor: c.border, color: c.text }, props.style]}
    />
  );
}

export function Empty({ icon, title, text, action }: { icon: IconName | string; title: string; text?: string; action?: React.ReactNode }) {
  const c = useColors();
  return (
    <View style={{ alignItems: 'center', padding: 30, gap: 8 }}>
      <Icon name={icon} size={36} color={c.faint} />
      <Txt variant="h3">{title}</Txt>
      {text ? <Txt variant="sub" style={{ textAlign: 'center' }}>{text}</Txt> : null}
      {action}
    </View>
  );
}

export function Pill({ text, color }: { text: string; color?: string }) {
  const c = useColors();
  const col = color ?? c.primary;
  return (
    <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99, backgroundColor: col + '22', alignSelf: 'flex-start' }}>
      <Text style={{ color: col, fontWeight: '700', fontSize: 11.5 }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 18, gap: 18, paddingBottom: 110 },
  header: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  card: { borderRadius: radius.m, padding: 16, borderWidth: StyleSheet.hairlineWidth },
  btn: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', paddingVertical: 14, paddingHorizontal: 18, borderRadius: 14 },
  btnSmall: { paddingVertical: 9, paddingHorizontal: 12, borderRadius: 11 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 99, borderWidth: StyleSheet.hairlineWidth },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
});
