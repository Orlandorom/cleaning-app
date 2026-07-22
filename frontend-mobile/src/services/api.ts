import axios from 'axios';
import { Platform } from 'react-native';

const API_BASE_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:3000'
  : 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

let storedToken: string | null = null;

api.interceptors.request.use((config) => {
  if (storedToken) {
    config.headers.Authorization = `Bearer ${storedToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storedToken = null;
    }
    return Promise.reject(error);
  },
);

export function setStoredToken(token: string | null) {
  storedToken = token;
}

export function getStoredToken(): string | null {
  return storedToken;
}

export function clearStoredToken() {
  storedToken = null;
}

export default api;
