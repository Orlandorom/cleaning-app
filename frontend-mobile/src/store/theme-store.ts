import { create } from 'zustand';
import { storage, mmkvKeys } from '@/lib/mmkv';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  setSystemDark: (dark: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'system',
  isDark: false,

  setMode: (mode) => {
    storage.set(mmkvKeys.THEME_MODE, mode);
    set({ mode });
  },

  setSystemDark: (dark) => {
    const { mode } = get();
    if (mode === 'system') {
      set({ isDark: dark });
    }
  },
}));
