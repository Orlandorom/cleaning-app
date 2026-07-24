import { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const sizeMap: Record<AvatarSize, { container: string; text: string; image: number }> = {
  sm: { container: 'h-8 w-8', text: 'text-xs', image: 32 },
  md: { container: 'h-12 w-12', text: 'text-sm', image: 48 },
  lg: { container: 'h-16 w-16', text: 'text-lg', image: 64 },
  xl: { container: 'h-24 w-24', text: 'text-2xl', image: 96 },
};

export interface AvatarProps {
  source?: { uri: string } | null;
  name?: string;
  size?: AvatarSize;
  variant?: 'circle' | 'rounded' | 'square';
  className?: string;
}

function getInitials(name?: string): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getColorFromName(name?: string): string {
  if (!name) return 'bg-gray-300';
  const colors = [
    'bg-primary-500',
    'bg-success-500',
    'bg-warning-500',
    'bg-error-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];
  const index = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  return colors[index];
}

const variantStyles = {
  circle: 'rounded-full',
  rounded: 'rounded-lg',
  square: 'rounded-none',
};

export function Avatar({
  source,
  name,
  size = 'md',
  variant = 'circle',
  className,
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);
  const showImage = source?.uri && !hasError;

  return (
    <View
      className={twMerge(
        'items-center justify-center overflow-hidden',
        sizeMap[size].container,
        variantStyles[variant],
        !showImage ? getColorFromName(name) : '',
        className,
      )}
    >
      {showImage ? (
        <Image
          source={source}
          style={{ width: sizeMap[size].image, height: sizeMap[size].image }}
          className={twMerge('h-full w-full', variantStyles[variant])}
          onError={() => setHasError(true)}
        />
      ) : (
        <Text className={twMerge('font-bold text-white', sizeMap[size].text)}>
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
}
