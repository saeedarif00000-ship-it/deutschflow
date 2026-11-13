import { DarkTheme, DefaultTheme, router, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { checkAchievements } from '@/lib/learning';
import { configureNotifications, Notifications, notificationsSupported, rescheduleVocabNotifications } from '@/lib/notifications';
import { useStore } from '@/lib/store';
import { pushProgress, restoreToken } from '@/lib/sync';
import { useColors, useIsDark } from '@/lib/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});
configureNotifications();

export default function RootLayout() {
  const c = useColors();
  const dark = useIsDark();
  const [hydrated, setHydrated] = useState(useStore.persist.hasHydrated());
  const onboarded = useStore((s) => s.settings.onboarded);

  useEffect(() => {
    const unsub = useStore.persist.onFinishHydration(() => setHydrated(true));
    const t = setTimeout(() => setHydrated(true), 2500); // never block the UI on storage
    return () => {
      unsub();
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    SplashScreen.hideAsync().catch(() => {});
    restoreToken().catch(() => {});
    rescheduleVocabNotifications().catch(() => {});
    if (!onboarded) setTimeout(() => router.replace('/onboarding'), 0);

    // Top up the notification batch whenever the app returns to the foreground
    const sub = AppState.addEventListener('change', (st) => {
      if (st === 'active') {
        rescheduleVocabNotifications().catch(() => {});
        checkAchievements();
      } else if (st === 'background') {
        pushProgress().catch(() => {});
      }
    });
    return () => sub.remove();
  }, [hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  // Count active study minutes
  useEffect(() => {
    const t = setInterval(() => {
      if (AppState.currentState === 'active') useStore.getState().bumpDay({ minutes: 1 });
    }, 60_000);
    return () => clearInterval(t);
  }, []);

  // Deep-link from a tapped vocabulary notification
  useEffect(() => {
    if (!notificationsSupported) return;
    const open = (n: any) => {
      const url = n?.request?.content?.data?.url;
      if (typeof url === 'string') router.push(url as any);
    };
    Notifications.getLastNotificationResponseAsync?.().then((r) => r && open(r.notification)).catch(() => {});
    const sub = Notifications.addNotificationResponseReceivedListener((r) => open(r.notification));
    return () => sub.remove();
  }, []);

  const navTheme = dark ? DarkTheme : DefaultTheme;
  const theme = { ...navTheme, colors: { ...navTheme.colors, background: c.bg, card: c.bg, text: c.text, primary: c.primary, border: c.border } };

  if (!hydrated) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={theme}>
        <StatusBar style={dark ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShadowVisible: false,
            headerStyle: { backgroundColor: c.bg },
            headerTintColor: c.text,
            headerTitleStyle: { fontWeight: '700' },
            headerBackButtonDisplayMode: 'minimal',
            contentStyle: { backgroundColor: c.bg },
            animation: Platform.OS === 'android' ? 'fade_from_bottom' : 'default',
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="flow" options={{ presentation: 'fullScreenModal', headerShown: false }} />
          <Stack.Screen name="review" options={{ title: 'Review' }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
