import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { smsService } from '@/services/sms';
import { authService } from '@/services/auth';
import { useAuthStore } from '@/store/auth-store';
import { useToastStore } from '@/store/toast-store';
import type { LoginDto } from '@/types/auth';

export function useSendOtp() {
  return useMutation({
    mutationFn: (phone: string) => smsService.sendOtp({ phone }),
    onError: (error: any) => {
      const message = error?.response?.data?.message ?? 'Error al enviar el código';
      useToastStore.getState().showToast(message, 'error');
    },
  });
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: (dto: LoginDto) => authService.login(dto),
    onSuccess: (response) => {
      const { accessToken, refreshToken, user } = response.data;
      setAuth({ token: accessToken, refreshToken, user });
      router.replace('/(tabs)');
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      const message =
        error?.response?.data?.message ??
        'Error al iniciar sesión';

      if (status === 404) {
        useToastStore.getState().showToast(
          'Usuario no encontrado. Contacta al administrador.',
          'warning',
        );
      } else {
        useToastStore.getState().showToast(message, 'error');
      }
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      logout();
      router.replace('/(auth)/welcome');
    },
  });
}
