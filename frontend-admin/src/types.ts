export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Provider {
  id: string;
  name: string;
  phone: string;
  email?: string;
  description?: string;
  rating: number;
  isAvailable: boolean;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
  services: ProviderService[];
}

export interface ProviderService {
  providerId: string;
  serviceId: string;
  service: Service;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  type: string;
  price: number;
  duration: number;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Booking {
  id: string;
  clientId: string;
  providerId: string;
  serviceId: string;
  status: BookingStatus;
  scheduledAt: string;
  address: string;
  notes?: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  client?: Client;
  provider?: Provider;
  service?: Service;
}
