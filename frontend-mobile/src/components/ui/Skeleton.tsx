import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

const SHIMMER_DURATION = 1500;

function useShimmer() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: SHIMMER_DURATION / 2,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: SHIMMER_DURATION / 2,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return opacity;
}

export interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  variant?: 'text' | 'circular' | 'rectangular';
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius,
  variant = 'text',
  className,
}: SkeletonProps) {
  const opacity = useShimmer();

  const computedBorderRadius = borderRadius ?? (variant === 'circular' ? height / 2 : variant === 'text' ? 4 : 8);

  return (
    <Animated.View
      className={twMerge('bg-gray-200', className)}
      style={{
        width: width as any,
        height,
        borderRadius: computedBorderRadius,
        opacity,
      }}
    />
  );
}

export interface SkeletonGroupProps {
  count?: number;
  itemHeight?: number;
  spacing?: number;
  className?: string;
}

export function SkeletonGroup({
  count = 3,
  itemHeight = 16,
  spacing = 12,
  className,
}: SkeletonGroupProps) {
  return (
    <View className={twMerge('px-4 py-2', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={{ marginBottom: i < count - 1 ? spacing : 0 }}>
          <Skeleton
            width={i % 2 === 0 ? '100%' : '75%'}
            height={itemHeight}
            variant="text"
          />
        </View>
      ))}
    </View>
  );
}
