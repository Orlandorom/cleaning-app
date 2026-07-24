import type { Client, Provider } from './api';

export type UserRole = 'CLIENT' | 'PROVIDER' | 'ADMIN';

export interface User {
  id: string;
  phone: string;
  role: UserRole;
}

export interface RegisterDto {
  phone: string;
  code: string;
  name: string;
  role: UserRole;
  email?: string;
  cityId?: string;
  description?: string;
}

export interface LoginDto {
  phone: string;
  code: string;
}

export interface RefreshDto {
  refreshToken: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface ProfileResponse {
  user: User;
  client: Client | null;
  provider: Provider | null;
}
