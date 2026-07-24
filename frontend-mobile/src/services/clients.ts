import { api } from './api';
import type { Client } from '@/types/api';

export interface QueryClientsParams {
  search?: string;
}

export const clientsService = {
  getAll(params?: QueryClientsParams) {
    return api.get<Client[]>('/clients', { params });
  },

  getById(id: string) {
    return api.get<Client>(`/clients/${id}`);
  },
};
