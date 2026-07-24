import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToastStore, type ToastItem, type ToastType } from '@/store/toast-store';
import { twMerge } from 'tailwind-merge';

const BG_COLORS: Record<ToastType, string> = {
  success: 'bg-success-500',
  error: 'bg-error-500',
  warning: 'bg-warning-500',
  info: 'bg-primary-500',
};

const ICONS: Record<ToastType, string> = {
  success: '\u2713',
  error: '\u2717',
  warning: '\u26A0',
  info: '\u2139',
};

function ToastComponent({ toast }: { toast: ToastItem }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  const removeToast = useToastStore((s) => s.hideToast);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -20, duration: 300, useNativeDriver: true }),
      ]).start(() => removeToast(toast.id));
    }, toast.duration ?? 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={{ opacity, transform: [{ translateY }] }}
      className={twMerge(
        'mx-4 mb-2 flex-row items-center rounded-lg px-4 py-3 shadow-lg',
        BG_COLORS[toast.type],
      )}
    >
      <Text className="mr-2 text-base text-white">{ICONS[toast.type]}</Text>
      <Text className="flex-1 text-sm font-medium text-white">{toast.message}</Text>
    </Animated.View>
  );
}

export interface ToastProviderProps {
  children: React.ReactNode;
  position?: 'top' | 'bottom';
}

export function ToastProvider({ children, position = 'top' }: ToastProviderProps) {
  const toasts = useToastStore((s) => s.toasts);
  const insets = useSafeAreaInsets();

  const containerStyle = position === 'top'
    ? { top: insets.top + 8 }
    : { bottom: 16 };

  return (
    <View className="flex-1">
      {children}
      <View
        className="absolute left-0 right-0 z-50"
        style={containerStyle}
        pointerEvents="box-none"
      >
        {toasts.map((t) => (
          <ToastComponent key={t.id} toast={t} />
        ))}
      </View>
    </View>
  );
}
