import axios from 'axios';
import { Platform } from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import { useToastStore } from '@/store/toast-store';

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  pendingQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else if (token) {
      p.resolve(token);
    }
  });
  pendingQueue = [];
}

const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:3000',
  ios: 'http://localhost:3000',
  default: 'http://localhost:3000',
});

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      useToastStore.getState().showToast(
        'No se puede conectar con el servidor',
        'error',
      );
      return Promise.reject(error);
    }

    const { status, config: originalRequest, data } = error.response;

    if (status === 401 && !originalRequest._retry) {
      const refreshToken = useAuthStore.getState().refreshToken;

      if (!refreshToken) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data: refreshData } = await axios.post<{
          accessToken: string;
          refreshToken: string;
        }>(`${BASE_URL}/auth/refresh`, { refreshToken });

        useAuthStore.getState().setTokens(
          refreshData.accessToken,
          refreshData.refreshToken,
        );

        processQueue(null, refreshData.accessToken);

        originalRequest.headers.Authorization = `Bearer ${refreshData.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const message =
      typeof data?.message === 'string'
        ? data.message
        : Array.isArray(data?.message)
          ? data.message[0]
          : 'Error inesperado';

    if (status !== 401) {
      useToastStore.getState().showToast(message, 'error');
    }

    return Promise.reject(error);
  },
);

export function getApiUrl(): string {
  return BASE_URL;
}
