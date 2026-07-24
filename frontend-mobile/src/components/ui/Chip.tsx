import { type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

export type ChipVariant = 'filled' | 'outline' | 'ghost';
export type ChipSize = 'sm' | 'md';

const chipVariants = {
  filled: {
    default: 'bg-primary-100 border-primary-100',
    selected: 'bg-primary-500 border-primary-500',
    disabled: 'bg-gray-100 border-gray-100',
  },
  outline: {
    default: 'bg-transparent border-gray-300',
    selected: 'bg-primary-50 border-primary-500',
    disabled: 'bg-gray-50 border-gray-200',
  },
  ghost: {
    default: 'bg-transparent border-transparent',
    selected: 'bg-primary-50 border-transparent',
    disabled: 'bg-gray-50 border-transparent',
  },
};

const textVariants = {
  filled: {
    default: 'text-primary-700',
    selected: 'text-white',
    disabled: 'text-gray-400',
  },
  outline: {
    default: 'text-gray-700',
    selected: 'text-primary-700',
    disabled: 'text-gray-400',
  },
  ghost: {
    default: 'text-gray-700',
    selected: 'text-primary-700',
    disabled: 'text-gray-400',
  },
};

const sizeStyles = {
  sm: 'px-2.5 py-1',
  md: 'px-3 py-1.5',
};

const textSizeStyles = {
  sm: 'text-xs',
  md: 'text-sm',
};

export interface ChipProps {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  variant?: ChipVariant;
  size?: ChipSize;
  leftIcon?: ReactNode;
  closable?: boolean;
  onPress?: () => void;
  onClose?: () => void;
  className?: string;
}

export function Chip({
  label,
  selected = false,
  disabled = false,
  variant = 'filled',
  size = 'md',
  leftIcon,
  closable,
  onPress,
  onClose,
  className,
}: ChipProps) {
  const state = disabled ? 'disabled' : selected ? 'selected' : 'default';

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      className={twMerge(
        'flex-row items-center self-start rounded-full border',
        chipVariants[variant][state],
        sizeStyles[size],
        disabled ? 'opacity-60' : '',
        className,
      )}
    >
      {leftIcon && <View className="mr-1">{leftIcon}</View>}
      <Text className={twMerge('font-medium', textVariants[variant][state], textSizeStyles[size])}>
        {label}
      </Text>
      {closable && onClose && (
        <Pressable
          onPress={(e) => {
            e.stopPropagation?.();
            onClose();
          }}
          className="ml-1.5"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text className={twMerge('text-base leading-none', textVariants[variant][state])}>
            \u00D7
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
}
