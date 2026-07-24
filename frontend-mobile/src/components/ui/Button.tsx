import { type VariantProps, cva } from 'class-variance-authority';
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
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? 'white' : '#374151'}
          className="mr-2"
        />
      )}
      <Text className={textVariants({ variant, size })}>
        {loading ? 'Cargando...' : title}
      </Text>
    </Pressable>
  );
}
