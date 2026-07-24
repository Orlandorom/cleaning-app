import { useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onSubmitEditing?: () => void;
  autoFocus?: boolean;
  showCancel?: boolean;
  cancelLabel?: string;
  onCancel?: () => void;
  disabled?: boolean;
  className?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Buscar...',
  onClear,
  onSubmitEditing,
  autoFocus,
  showCancel = false,
  cancelLabel = 'Cancelar',
  onCancel,
  disabled,
  className,
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  return (
    <View className={twMerge('flex-row items-center px-4 py-2', className)}>
      <View
        className={twMerge(
          'flex-1 flex-row items-center rounded-xl bg-gray-100 px-3',
          focused ? 'border border-primary-500' : '',
        )}
      >
        <Text className="mr-2 text-base text-gray-400">{'\u2315'}</Text>
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          autoFocus={autoFocus}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!disabled}
          returnKeyType="search"
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 py-2.5 text-base text-gray-900"
        />
        {value.length > 0 && (
          <Pressable
            onPress={() => {
              onChangeText('');
              onClear?.();
            }}
            className="ml-1 h-6 w-6 items-center justify-center rounded-full bg-gray-300"
          >
            <Text className="text-xs font-bold text-white">{'\u2715'}</Text>
          </Pressable>
        )}
      </View>

      {showCancel && focused && (
        <Pressable
          onPress={() => {
            inputRef.current?.blur();
            onCancel?.();
          }}
          className="ml-2"
        >
          <Text className="text-sm text-primary-500">{cancelLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}
