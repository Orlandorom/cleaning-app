import { useColorScheme as useNativeColorScheme } from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import { useEffect } from 'react';

export function useColorScheme() {
  const systemScheme = useNativeColorScheme();
  const { mode, setSystemDark } = useThemeStore();

  useEffect(() => {
    setSystemDark(systemScheme === 'dark');
  }, [systemScheme, setSystemDark]);

  const resolvedIsDark = mode === 'system'
    ? systemScheme === 'dark'
    : mode === 'dark';

  return resolvedIsDark ? 'dark' : 'light';
}
