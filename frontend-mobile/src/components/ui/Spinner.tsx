import { ActivityIndicator, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

export interface SpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  className?: string;
}

export function Spinner({ size = 'small', color = '#2563eb', className }: SpinnerProps) {
  return (
    <View className={twMerge('items-center justify-center', className)}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}
