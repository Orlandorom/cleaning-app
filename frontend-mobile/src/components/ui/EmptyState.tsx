import { Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ title, description, actionLabel, onAction, className }: EmptyStateProps) {
  return (
    <View className={twMerge('items-center justify-center px-6 py-12', className)}>
      <Text className="mb-2 text-lg font-semibold text-gray-500">{title}</Text>
      {description && (
        <Text className="mb-6 text-center text-sm text-gray-400">{description}</Text>
      )}
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} variant="outline" size="sm" />
      )}
    </View>
  );
}
