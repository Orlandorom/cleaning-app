import { type ReactNode } from 'react';
import { Modal as RNModal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const widthMap: Record<ModalSize, string> = {
  sm: 'w-3/4 max-w-sm',
  md: 'w-11/12 max-w-md',
  lg: 'w-11/12 max-w-lg',
  xl: 'w-11/12 max-w-xl',
  full: 'w-full max-w-full',
};

export interface ModalProps {
  visible: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  size?: ModalSize;
  showCloseButton?: boolean;
  animationType?: 'none' | 'fade' | 'slide';
  className?: string;
}

export function Modal({
  visible,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  animationType = 'fade',
  className,
}: ModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType={animationType}
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/50 px-4"
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation?.()}
          className={twMerge(
            'max-h-[85%] rounded-2xl bg-white p-6 shadow-xl',
            widthMap[size],
            className,
          )}
          style={{ marginTop: insets.top + 20, marginBottom: insets.bottom + 20 }}
        >
          {(title || showCloseButton) && (
            <View className="mb-4 flex-row items-center justify-between">
              {title ? (
                <Text className="text-lg font-semibold text-gray-900">{title}</Text>
              ) : (
                <View />
              )}
              {showCloseButton && onClose && (
                <Pressable
                  onPress={onClose}
                  className="h-8 w-8 items-center justify-center rounded-full bg-gray-100"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text className="text-lg font-bold text-gray-500">\u2715</Text>
                </Pressable>
              )}
            </View>
          )}
          <View>{children}</View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
