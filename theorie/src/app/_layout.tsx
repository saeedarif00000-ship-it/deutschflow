import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useStore } from '@/lib/store';
import { useColors, useIsDark } from '@/lib/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const c = useColors();
  const dark = useIsDark();
  const [ready, setReady] = useState(useStore.persist.hasHydrated());
  useEffect(() => {
    const u = useStore.persist.onFinishHydration(() => setReady(true));
    const t = setTimeout(() => setReady(true), 2500);
    return () => { u(); clearTimeout(t); };
  }, []);
  useEffect(() => { if (ready) SplashScreen.hideAsync().catch(() => {}); }, [ready]);
  if (!ready) return null;
  const nav = dark ? DarkTheme : DefaultTheme;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={{ ...nav, colors: { ...nav.colors, background: c.bg, card: c.bg, text: c.text, primary: c.primary, border: c.border } }}>
        <StatusBar style={dark ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShadowVisible: false, headerStyle: { backgroundColor: c.bg }, headerTintColor: c.text, headerTitleStyle: { fontWeight: '700' }, headerBackButtonDisplayMode: 'minimal', contentStyle: { backgroundColor: c.bg } }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="exam-run" options={{ headerShown: false, gestureEnabled: false }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
