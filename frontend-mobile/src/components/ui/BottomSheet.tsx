import { useCallback, useEffect, useRef } from 'react';
import { Animated, Dimensions, PanResponder, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_ANIMATION_DURATION = 300;

export interface BottomSheetProps {
  visible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  snapPoint?: number;
}

export function BottomSheet({
  visible,
  onClose,
  children,
  snapPoint = 0.5,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const sheetHeight = SCREEN_HEIGHT * snapPoint;
  const translateY = useRef(new Animated.Value(sheetHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => gs.dy > 5,
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) {
          translateY.setValue(gs.dy);
        }
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > sheetHeight * 0.3) {
          closeSheet();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 20,
            stiffness: 200,
          }).start();
        }
      },
    }),
  ).current;

  const closeSheet = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: sheetHeight,
        duration: SHEET_ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: SHEET_ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => onClose?.());
  }, [sheetHeight, translateY, backdropOpacity, onClose]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 20,
          stiffness: 200,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: SHEET_ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View className="absolute inset-0 z-50">
      <Animated.View
        className="flex-1 bg-black/50"
        style={{ opacity: backdropOpacity }}
      >
        <Pressable className="flex-1" onPress={closeSheet} />
      </Animated.View>

      <Animated.View
        className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-white shadow-xl"
        style={{
          height: sheetHeight,
          transform: [{ translateY }],
          paddingBottom: insets.bottom,
        }}
        {...panResponder.panHandlers}
      >
        <View className="self-center my-2 h-1 w-10 rounded-full bg-gray-300" />
        <View className="flex-1 px-4">{children}</View>
      </Animated.View>
    </View>
  );
}
