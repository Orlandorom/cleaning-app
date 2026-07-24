import { api } from './api';
import type { City } from '@/types/api';

export interface QueryCitiesParams {
  search?: string;
}

export const citiesService = {
  getAll(params?: QueryCitiesParams) {
    return api.get<City[]>('/cities', { params });
  },

  getById(id: string) {
    return api.get<City>(`/cities/${id}`);
  },
};
