export const API_TIMEOUT = 15000;

export const OTP_LENGTH = 6;
export const OTP_RESEND_COOLDOWN = 30;
export const OTP_MAX_ATTEMPTS = 5;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
} as const;

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  IN_PROGRESS: 'En curso',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

export const SERVICE_TYPE_LABELS: Record<string, string> = {
  GENERAL: 'Limpieza general',
  DEEP: 'Limpieza profunda',
  CARPET: 'Limpieza de alfombras',
  WINDOW: 'Limpieza de ventanas',
  OFFICE: 'Limpieza de oficinas',
};

export const QUERY_KEYS = {
  CITIES: ['cities'] as const,
  SERVICES: ['services'] as const,
  PROVIDERS: ['providers'] as const,
  CLIENTS: ['clients'] as const,
  BOOKINGS: ['bookings'] as const,
  PROFILE: ['profile'] as const,
} as const;
