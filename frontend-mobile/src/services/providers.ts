import { api } from './api';
import type { Provider } from '@/types/api';

export interface QueryProvidersParams {
  search?: string;
  isAvailable?: boolean;
  cityId?: string;
}

export const providersService = {
  getAll(params?: QueryProvidersParams) {
    return api.get<Provider[]>('/providers', { params });
  },

  getById(id: string) {
    return api.get<Provider>(`/providers/${id}`);
  },
};
