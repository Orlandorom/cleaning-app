import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

export interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'phone-pad' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  className?: string;
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'none',
  multiline,
  numberOfLines,
  disabled,
  className,
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View className={twMerge('mb-4', className)}>
      {label && (
        <Text className="mb-1 text-sm font-medium text-gray-700">{label}</Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={!disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={twMerge(
          'rounded-lg border bg-white px-4 py-3 text-base text-gray-900',
          focused ? 'border-primary-500' : 'border-gray-300',
          error ? 'border-error-500' : '',
          disabled ? 'bg-gray-100 opacity-50' : '',
          multiline ? 'min-h-[100px] text-left' : '',
        )}
        placeholderTextColor="#9ca3af"
      />
      {error && (
        <Text className="mt-1 text-xs text-error-500">{error}</Text>
      )}
    </View>
  );
}
