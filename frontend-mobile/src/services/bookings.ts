import { api } from './api';
import type { Booking } from '@/types/api';

export interface CreateBookingDto {
  clientId: string;
  providerId: string;
  serviceId: string;
  scheduledAt: string;
  address: string;
  notes?: string;
  totalPrice: number;
}

export interface QueryBookingsParams {
  clientId?: string;
  providerId?: string;
  status?: string;
}

export const bookingsService = {
  create(dto: CreateBookingDto) {
    return api.post<Booking>('/bookings', dto);
  },

  getAll(params?: QueryBookingsParams) {
    return api.get<Booking[]>('/bookings', { params });
  },

  getById(id: string) {
    return api.get<Booking>(`/bookings/${id}`);
  },
};
