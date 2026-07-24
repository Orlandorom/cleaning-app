import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'cleaning-app-storage',
});

export const mmkvKeys = {
  AUTH_TOKEN: 'auth.token',
  AUTH_REFRESH_TOKEN: 'auth.refreshToken',
  AUTH_USER: 'auth.user',
  THEME_MODE: 'theme.mode',
} as const;
