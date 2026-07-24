import { api } from './api';
import type { Service } from '@/types/api';

export interface QueryServicesParams {
  search?: string;
  type?: string;
}

export const servicesService = {
  getAll(params?: QueryServicesParams) {
    return api.get<Service[]>('/services', { params });
  },

  getById(id: string) {
    return api.get<Service>(`/services/${id}`);
  },
};
