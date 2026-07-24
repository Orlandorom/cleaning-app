import { Tabs } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeStore } from '@/store/theme-store';
import { colors } from '@/theme/colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isDark } = useThemeStore();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: isDark ? '#9ca3af' : '#6b7280',
        tabBarStyle: {
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          borderTopColor: isDark ? '#374151' : '#e5e7eb',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    />
  );
}
