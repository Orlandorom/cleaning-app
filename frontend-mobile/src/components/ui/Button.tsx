import { type VariantProps, cva } from 'class-variance-authority';
import { type ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { twMerge } from 'tailwind-merge';

const buttonVariants = cva(
  'flex-row items-center justify-center rounded-lg',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 active:bg-primary-700',
        secondary: 'bg-gray-200 active:bg-gray-300',
        outline: 'border border-primary-500 active:bg-primary-50',
        ghost: 'active:bg-gray-100',
        danger: 'bg-error-500 active:bg-error-700',
      },
      size: {
        sm: 'px-3 py-2',
        md: 'px-4 py-3',
        lg: 'px-6 py-4',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

const textVariants = cva('font-semibold', {
  variants: {
    variant: {
      primary: 'text-white',
      secondary: 'text-gray-800',
      outline: 'text-primary-500',
      ghost: 'text-gray-700',
      danger: 'text-white',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
}

export function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant,
  size,
  fullWidth,
  leftIcon,
  rightIcon,
  className,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={twMerge(
        buttonVariants({ variant, size, fullWidth }),
        isDisabled && 'opacity-50',
        className,
      )}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? 'white' : '#374151'}
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text className={twMerge(textVariants({ variant, size }), leftIcon ? 'ml-2' : '', rightIcon ? 'mr-2' : '')}>
            {title}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </Pressable>
  );
}
