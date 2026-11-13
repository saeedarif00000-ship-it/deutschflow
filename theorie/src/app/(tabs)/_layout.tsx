import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColors } from '@/lib/theme';

const TABS = [
  { name: 'index', title: 'Start', icon: 'home' },
  { name: 'learn', title: 'Lernen', icon: 'school' },
  { name: 'exam', title: 'Prüfung', icon: 'document-text' },
  { name: 'signs', title: 'Zeichen', icon: 'warning' },
  { name: 'stats', title: 'Statistik', icon: 'stats-chart' },
] as const;

export default function TabLayout() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: c.primary, tabBarInactiveTintColor: c.faint, tabBarStyle: { backgroundColor: c.tabBar, borderTopColor: c.border, height: 60 + insets.bottom, paddingTop: 6, paddingBottom: Math.max(insets.bottom, 8) }, tabBarLabelStyle: { fontSize: 11, fontWeight: '600' } }}>
      {TABS.map((t) => (
        <Tabs.Screen key={t.name} name={t.name} options={{ title: t.title, tabBarIcon: ({ color, focused }) => <Ionicons name={(focused ? t.icon : `${t.icon}-outline`) as any} size={22} color={color as string} /> }} />
      ))}
    </Tabs>
  );
}
