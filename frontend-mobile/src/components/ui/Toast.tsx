import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { useToastStore, type ToastItem } from '@/store/toast-store';

const BG_COLORS: Record<ToastItem['type'], string> = {
  success: 'bg-success-500',
  error: 'bg-error-500',
  warning: 'bg-warning-500',
  info: 'bg-primary-500',
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
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={{ opacity, transform: [{ translateY }] }}
      className={`mx-4 mb-2 rounded-lg px-4 py-3 shadow-lg ${BG_COLORS[toast.type]}`}
    >
      <Text className="text-sm font-medium text-white">{toast.message}</Text>
    </Animated.View>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <View className="flex-1">
      {children}
      <View className="absolute left-0 right-0 top-12 z-50">
        {toasts.map((t) => (
          <ToastComponent key={t.id} toast={t} />
        ))}
      </View>
    </View>
  );
}
