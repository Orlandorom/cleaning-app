import { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Easing, Modal, Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

export type LoaderVariant = 'spinner' | 'dots';

export interface LoaderProps {
  size?: 'small' | 'large';
  color?: string;
  variant?: LoaderVariant;
  text?: string;
  overlay?: boolean;
  fullScreen?: boolean;
  className?: string;
}

function DotsLoader({ color = '#2563eb', size = 'small' }: { color?: string; size?: 'small' | 'large' }) {
  const dotSize = size === 'large' ? 12 : 8;
  const animations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    const sequence = animations.map((anim, i) =>
      Animated.sequence([
        Animated.delay(i * 200),
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 400,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 400,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ]),
        ),
      ]),
    );

    const parallel = Animated.parallel(sequence);
    parallel.start();

    return () => parallel.stop();
  }, []);

  return (
    <View className="flex-row items-center justify-center">
      {animations.map((anim, i) => (
        <Animated.View
          key={i}
          className="mx-1 rounded-full"
          style={{
            width: dotSize,
            height: dotSize,
            backgroundColor: color,
            opacity: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
            }),
            transform: [
              {
                scale: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1.2],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );
}

function SpinnerLoader({ size, color }: { size?: 'small' | 'large'; color?: string }) {
  return <ActivityIndicator size={size} color={color ?? '#2563eb'} />;
}

export function Loader({
  size = 'small',
  color,
  variant = 'spinner',
  text,
  overlay = false,
  fullScreen = false,
  className,
}: LoaderProps) {
  const content = (
    <View className={twMerge('items-center justify-center', fullScreen ? 'flex-1' : '', className)}>
      {variant === 'dots' ? (
        <DotsLoader color={color} size={size} />
      ) : (
        <SpinnerLoader size={size} color={color} />
      )}
      {text && (
        <Text className="mt-3 text-sm text-gray-500">{text}</Text>
      )}
    </View>
  );

  if (overlay) {
    return (
      <Modal transparent animationType="fade" statusBarTranslucent>
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="rounded-2xl bg-white p-8 shadow-lg">
            {variant === 'dots' ? (
              <DotsLoader color={color} size="large" />
            ) : (
              <SpinnerLoader size="large" color={color ?? '#2563eb'} />
            )}
            {text && (
              <Text className="mt-4 text-center text-sm text-gray-500">{text}</Text>
            )}
          </View>
        </View>
      </Modal>
    );
  }

  return content;
}
