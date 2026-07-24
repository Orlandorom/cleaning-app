import { useToastStore } from '@/store/toast-store';

export function useToast() {
  const { showToast, hideToast, clearToasts } = useToastStore();

  return {
    success: (message: string) => showToast(message, 'success'),
    error: (message: string) => showToast(message, 'error'),
    warning: (message: string) => showToast(message, 'warning'),
    info: (message: string) => showToast(message, 'info'),
    hide: hideToast,
    clear: clearToasts,
  };
}
