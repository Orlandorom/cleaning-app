export interface City {
  id: string;
  name: string;
  createdAt: string;
}

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
  reviews: number;
  isAvailable: boolean;
  latitude?: number;
  longitude?: number;
  cityId: string;
  city: City;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  type: ServiceType;
  duration: number;
  createdAt: string;
}

export type ServiceType = 'GENERAL' | 'DEEP' | 'CARPET' | 'WINDOW' | 'OFFICE';

export interface ProviderService {
  providerId: string;
  serviceId: string;
  price: number;
  service: Service;
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
  client: Client;
  provider: Provider;
  service: Service;
}
