import { create } from 'zustand';
import { storage, mmkvKeys } from '@/lib/mmkv';
import type { User } from '@/types/auth';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (params: { token: string; refreshToken: string; user: User }) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: ({ token, refreshToken, user }) => {
    storage.set(mmkvKeys.AUTH_TOKEN, token);
    storage.set(mmkvKeys.AUTH_REFRESH_TOKEN, refreshToken);
    storage.set(mmkvKeys.AUTH_USER, JSON.stringify(user));
    set({ token, refreshToken, user, isAuthenticated: true, isLoading: false });
  },

  setUser: (user) => {
    storage.set(mmkvKeys.AUTH_USER, JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    storage.delete(mmkvKeys.AUTH_TOKEN);
    storage.delete(mmkvKeys.AUTH_REFRESH_TOKEN);
    storage.delete(mmkvKeys.AUTH_USER);
    set({ token: null, refreshToken: null, user: null, isAuthenticated: false, isLoading: false });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  hydrate: () => {
    try {
      const token = storage.getString(mmkvKeys.AUTH_TOKEN);
      const refreshToken = storage.getString(mmkvKeys.AUTH_REFRESH_TOKEN);
      const userRaw = storage.getString(mmkvKeys.AUTH_USER);
      const user = userRaw ? JSON.parse(userRaw) : null;
      set({ token, refreshToken, user, isAuthenticated: !!token, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));
