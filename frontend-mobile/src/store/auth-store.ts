import { create } from 'zustand';
import { storage, mmkvKeys } from '@/lib/mmkv';
import type { User } from '@/types/auth';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  phone: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (params: { token: string; refreshToken: string; user: User }) => void;
  setTokens: (token: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  setPhone: (phone: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refreshToken: null,
  user: null,
  phone: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: ({ token, refreshToken, user }) => {
    storage.set(mmkvKeys.AUTH_TOKEN, token);
    storage.set(mmkvKeys.AUTH_REFRESH_TOKEN, refreshToken);
    storage.set(mmkvKeys.AUTH_USER, JSON.stringify(user));
    set({ token, refreshToken, user, isAuthenticated: true, isLoading: false });
  },

  setTokens: (token, refreshToken) => {
    storage.set(mmkvKeys.AUTH_TOKEN, token);
    storage.set(mmkvKeys.AUTH_REFRESH_TOKEN, refreshToken);
    set({ token, refreshToken });
  },

  setUser: (user) => {
    storage.set(mmkvKeys.AUTH_USER, JSON.stringify(user));
    set({ user });
  },

  setPhone: (phone) => {
    set({ phone });
  },

  logout: () => {
    storage.delete(mmkvKeys.AUTH_TOKEN);
    storage.delete(mmkvKeys.AUTH_REFRESH_TOKEN);
    storage.delete(mmkvKeys.AUTH_USER);
    set({
      token: null,
      refreshToken: null,
      user: null,
      phone: null,
      isAuthenticated: false,
      isLoading: false,
    });
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
