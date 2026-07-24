import { type ReactNode, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

export interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'phone-pad' | 'email-address' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoFocus?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helperText,
  required,
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'none',
  autoFocus,
  multiline,
  numberOfLines,
  maxLength,
  disabled,
  leftIcon,
  rightIcon,
  className,
}: InputProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? 'border-error-500'
    : focused
      ? 'border-primary-500'
      : 'border-gray-300';

  return (
    <View className={twMerge('mb-4', className)}>
      {label && (
        <Text className="mb-1 text-sm font-medium text-gray-700">
          {label}
          {required && <Text className="text-error-500"> *</Text>}
        </Text>
      )}
      <View className={twMerge(
        'flex-row items-center rounded-lg border bg-white',
        borderColor,
        disabled ? 'bg-gray-100 opacity-50' : '',
      )}>
        {leftIcon && <View className="pl-3">{leftIcon}</View>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoFocus={autoFocus}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          editable={!disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={twMerge(
            'flex-1 px-4 py-3 text-base text-gray-900',
            leftIcon ? 'pl-2' : '',
            rightIcon ? 'pr-2' : '',
            multiline ? 'min-h-[100px] text-left' : '',
          )}
          placeholderTextColor="#9ca3af"
        />
        {rightIcon && <View className="pr-3">{rightIcon}</View>}
      </View>
      {error && (
        <Text className="mt-1 text-xs text-error-500">{error}</Text>
      )}
      {helperText && !error && (
        <Text className="mt-1 text-xs text-gray-400">{helperText}</Text>
      )}
    </View>
  );
}
