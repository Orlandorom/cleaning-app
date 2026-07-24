import { Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-success-100 text-success-700',
  warning: 'bg-warning-100 text-warning-700',
  error: 'bg-error-100 text-error-700',
};

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ label, variant = 'default', className }: BadgeProps) {
  return (
    <View className={twMerge('self-start rounded-full px-2.5 py-1', variantStyles[variant].split(' ')[0], className)}>
      <Text className={twMerge('text-xs font-medium', variantStyles[variant].split(' ')[1])}>
        {label}
      </Text>
    </View>
  );
}
