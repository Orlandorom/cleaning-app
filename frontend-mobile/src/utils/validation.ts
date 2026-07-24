import { z } from 'zod';

export const phoneSchema = z
  .string()
  .regex(/^\+[1-9]\d{6,14}$/, 'Debe ser un número válido en formato internacional (ej: +573001234567)');

export const otpSchema = z
  .string()
  .length(6, 'El código debe tener 6 dígitos')
  .regex(/^\d{6}$/, 'El código debe contener solo números');

export const registerSchema = z.object({
  phone: phoneSchema,
  code: otpSchema,
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100, 'El nombre no puede exceder 100 caracteres'),
  role: z.enum(['CLIENT', 'PROVIDER']),
  email: z.string().email('Correo inválido').optional().or(z.literal('')),
  cityId: z.string().uuid('Ciudad inválida').optional(),
  description: z.string().optional(),
});

export const loginSchema = z.object({
  phone: phoneSchema,
  code: otpSchema,
});

export const createBookingSchema = z.object({
  clientId: z.string().uuid(),
  providerId: z.string().uuid(),
  serviceId: z.string().uuid(),
  scheduledAt: z.string().min(1, 'La fecha es requerida'),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  notes: z.string().optional(),
  totalPrice: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type CreateBookingFormData = z.infer<typeof createBookingSchema>;
