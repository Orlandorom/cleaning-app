import { type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  leftAction?: ReactNode;
  onLeftPress?: () => void;
  rightActions?: Array<{ icon: ReactNode; onPress?: () => void; key: string }>;
  className?: string;
}

export function Header({
  title,
  subtitle,
  leftAction,
  onLeftPress,
  rightActions,
  className,
}: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className={twMerge('bg-white', className)}
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="min-w-[48px] items-start">
          {leftAction && (
            <Pressable onPress={onLeftPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              {leftAction}
            </Pressable>
          )}
        </View>

        <View className="flex-1 items-center px-2">
          {title && (
            <Text className="text-lg font-semibold text-gray-900" numberOfLines={1}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text className="text-xs text-gray-500" numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        <View className="min-w-[48px] flex-row items-center justify-end gap-2">
          {rightActions?.map((action) => (
            <Pressable
              key={action.key}
              onPress={action.onPress}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {action.icon}
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
