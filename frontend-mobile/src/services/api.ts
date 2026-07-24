import axios from 'axios';
import { Platform } from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import { useToastStore } from '@/store/toast-store';

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
    if (error.response) {
      const { status, data } = error.response;
      const message = typeof data?.message === 'string'
        ? data.message
        : Array.isArray(data?.message)
          ? data.message[0]
          : 'Error inesperado';

      if (status === 401) {
        useAuthStore.getState().logout();
      }

      if (status !== 401) {
        useToastStore.getState().showToast(message, 'error');
      }
    } else if (error.request) {
      useToastStore.getState().showToast(
        'No se puede conectar con el servidor',
        'error',
      );
    }
    return Promise.reject(error);
  },
);

export function getApiUrl(): string {
  return BASE_URL;
}
