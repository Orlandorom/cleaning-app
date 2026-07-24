import { View } from 'react-native';
import { twMerge } from 'tailwind-merge';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <View className={twMerge('rounded-xl bg-white p-4 shadow-sm', className)}>
      {children}
    </View>
  );
}
