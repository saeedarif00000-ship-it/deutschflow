import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/tabs';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useT } from '@/lib/i18n';
import { useColors } from '@/lib/theme';

const TABS: { name: string; key: string; icon: keyof typeof Ionicons.glyphMap; iconActive: keyof typeof Ionicons.glyphMap }[] = [
  { name: 'index', key: 'home', icon: 'home-outline', iconActive: 'home' },
  { name: 'vocabulary', key: 'vocabulary', icon: 'albums-outline', iconActive: 'albums' },
  { name: 'reading', key: 'reading', icon: 'book-outline', iconActive: 'book' },
  { name: 'grammar', key: 'grammar', icon: 'construct-outline', iconActive: 'construct' },
  { name: 'speaking', key: 'speaking', icon: 'mic-outline', iconActive: 'mic' },
  { name: 'games', key: 'games', icon: 'game-controller-outline', iconActive: 'game-controller' },
  { name: 'progress', key: 'progress', icon: 'stats-chart-outline', iconActive: 'stats-chart' },
];

export default function TabLayout() {
  const c = useColors();
  const t = useT();
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.faint,
        tabBarStyle: {
          backgroundColor: c.tabBar,
          borderTopColor: c.border,
          height: 58 + insets.bottom,
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 6),
        },
        tabBarLabelStyle: { fontSize: 9.5, fontWeight: '600' },
        tabBarItemStyle: { paddingHorizontal: 0 },
      }}>
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: t(tab.key),
            tabBarLabel: t(tab.key === 'progress' ? 'progress' : tab.key).split(' ').slice(-1)[0],
            tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? tab.iconActive : tab.icon} size={22} color={color as string} />,
          }}
        />
      ))}
    </Tabs>
  );
}
