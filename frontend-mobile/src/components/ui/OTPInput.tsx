import { useCallback, useEffect, useRef } from 'react';
import { Text, TextInput, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

export interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  error,
  disabled,
  autoFocus = true,
  className,
}: OTPInputProps) {
  const inputRef = useRef<TextInput>(null);
  const boxes = Array.from({ length }, (_, i) => value[i] ?? '');

  const handlePress = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (autoFocus && !disabled) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [autoFocus, disabled]);

  return (
    <View className={twMerge('items-center', className)}>
      <View className="flex-row gap-2">
        {boxes.map((digit, i) => (
          <View
            key={i}
            className={twMerge(
              'h-14 w-12 items-center justify-center rounded-xl border-2 bg-white',
              error ? 'border-error-500' : digit ? 'border-primary-500' : 'border-gray-300',
              disabled ? 'bg-gray-100 opacity-50' : '',
            )}
          >
            <Text
              className={twMerge(
                'text-2xl font-bold',
                digit ? 'text-gray-900' : 'text-transparent',
                error ? 'text-error-500' : '',
              )}
            >
              {digit || '0'}
            </Text>
          </View>
        ))}
      </View>

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => {
          const cleaned = text.replace(/[^0-9]/g, '').slice(0, length);
          onChange(cleaned);
        }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        maxLength={length}
        editable={!disabled}
        className="absolute h-0 w-0 opacity-0"
        autoFocus={autoFocus}
      />

      {error && (
        <Text className="mt-2 text-xs text-error-500">{error}</Text>
      )}
    </View>
  );
}
