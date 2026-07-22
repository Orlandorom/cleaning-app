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
  type: ServiceType;
  price: number;
  duration: number;
}

export type ServiceType = 'GENERAL' | 'DEEP' | 'CARPET' | 'WINDOW' | 'OFFICE';

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
  provider?: Provider;
  service?: Service;
}

export interface AuthResponse {
  token: string;
  client: Client;
}

export type RootStackParamList = {
  Home: undefined;
  ClientForm: { service?: Service } | undefined;
  ProviderList: { serviceId: string; client: { name: string; phone: string; address: string } };
  Success: { bookingId: string };
};
