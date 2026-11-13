import { useColorScheme } from 'react-native';
import { useStore } from './store';

export const palette = {
  light: {
    bg: '#F6F5F1',
    card: '#FFFFFF',
    cardAlt: '#EFEDE6',
    text: '#17171C',
    sub: '#5E5E6B',
    faint: '#9A9AA5',
    border: '#E3E1D8',
    primary: '#3D43D8',
    primaryText: '#FFFFFF',
    accent: '#F2A93B',
    success: '#1E9E62',
    danger: '#D6453D',
    der: '#2F6FE0',
    die: '#D64571',
    das: '#1E9E62',
    tabBar: '#FFFFFF',
  },
  dark: {
    bg: '#0F1014',
    card: '#1A1B22',
    cardAlt: '#23242D',
    text: '#F3F2EE',
    sub: '#A7A7B3',
    faint: '#6C6C78',
    border: '#2C2D38',
    primary: '#7C80FF',
    primaryText: '#0F1014',
    accent: '#F5B95A',
    success: '#3CCB86',
    danger: '#FF6B61',
    der: '#6FA2FF',
    die: '#FF7AA2',
    das: '#4CD394',
    tabBar: '#15161C',
  },
};

export type Colors = typeof palette.light;

export function useColors(): Colors {
  const system = useColorScheme();
  const pref = useStore((s) => s.settings.theme);
  const mode = pref === 'system' ? (system === 'dark' ? 'dark' : 'light') : pref;
  return palette[mode] ?? palette.light;
}

export function useIsDark() {
  const system = useColorScheme();
  const pref = useStore((s) => s.settings.theme);
  return pref === 'system' ? system === 'dark' : pref === 'dark';
}

export const genderColor = (c: Colors, g?: string) =>
  g === 'der' ? c.der : g === 'die' ? c.die : g === 'das' ? c.das : c.primary;

export const radius = { s: 10, m: 16, l: 24 };
export const space = (n: number) => n * 4;
