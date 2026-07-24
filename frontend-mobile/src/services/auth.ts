import { api } from './api';
import type { RegisterDto, LoginDto, RefreshDto, AuthResponse, ProfileResponse } from '@/types/auth';

export const authService = {
  register(dto: RegisterDto) {
    return api.post<AuthResponse>('/auth/register', dto);
  },

  login(dto: LoginDto) {
    return api.post<AuthResponse>('/auth/login', dto);
  },

  refresh(dto: RefreshDto) {
    return api.post<AuthResponse>('/auth/refresh', dto);
  },

  logout() {
    return api.post<{ message: string }>('/auth/logout');
  },

  getProfile() {
    return api.get<ProfileResponse>('/auth/profile');
  },
};
