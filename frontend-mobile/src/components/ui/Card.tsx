import { type ReactNode } from 'react';
import { type ViewProps } from 'react-native';
import { View } from 'react-native';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends ViewProps {
  children: ReactNode;
  variant?: 'elevated' | 'outlined' | 'ghost';
  padded?: boolean;
}

export function Card({
  children,
  variant = 'elevated',
  padded = true,
  className,
  ...props
}: CardProps) {
  const variantStyles = {
    elevated: 'bg-white shadow-sm',
    outlined: 'border border-gray-200 bg-white',
    ghost: 'bg-gray-50',
  };

  return (
    <View
      className={twMerge(
        'rounded-xl',
        variantStyles[variant],
        padded ? 'p-4' : '',
        className,
      )}
      {...props}
    >
      {children}
    </View>
  );
}
