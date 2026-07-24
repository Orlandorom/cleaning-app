import { type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';
export type BadgeSize = 'sm' | 'md';

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100',
  primary: 'bg-primary-100',
  success: 'bg-success-100',
  warning: 'bg-warning-100',
  error: 'bg-error-100',
};

const textStyles: Record<BadgeVariant, string> = {
  default: 'text-gray-700',
  primary: 'text-primary-700',
  success: 'text-success-700',
  warning: 'text-warning-700',
  error: 'text-error-700',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5',
  md: 'px-2.5 py-1',
};

const textSizeStyles: Record<BadgeSize, string> = {
  sm: 'text-[10px]',
  md: 'text-xs',
};

export interface BadgeProps {
  label?: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  leftIcon?: ReactNode;
  className?: string;
}

export function Badge({
  label,
  variant = 'default',
  size = 'md',
  dot = false,
  leftIcon,
  className,
}: BadgeProps) {
  return (
    <View className={twMerge(
      'flex-row items-center self-start rounded-full',
      variantStyles[variant],
      sizeStyles[size],
      className,
    )}>
      {dot && (
        <View className={twMerge(
          'mr-1.5 h-2 w-2 rounded-full',
          variantStyles[variant].replace('bg-', 'bg-').replace('100', '500'),
        )} />
      )}
      {leftIcon && <View className="mr-1">{leftIcon}</View>}
      {label && (
        <Text className={twMerge(
          'font-medium',
          textStyles[variant],
          textSizeStyles[size],
        )}>
          {label}
        </Text>
      )}
    </View>
  );
}
