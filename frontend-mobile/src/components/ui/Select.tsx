import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';
import { Modal } from './Modal';
import { Chip } from './Chip';
import { SearchBar } from './SearchBar';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  selectedValue?: string;
  selectedValues?: string[];
  onSelect: (value: string) => void;
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Select({
  label,
  options,
  selectedValue,
  selectedValues,
  onSelect,
  placeholder = 'Seleccionar...',
  multiple = false,
  searchable = false,
  error,
  required,
  disabled,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const insets = useSafeAreaInsets();

  const singleSelected = options.find((o) => o.value === selectedValue);
  const multiSelected = options.filter((o) => selectedValues?.includes(o.value));

  const filtered = searchable
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  const displayText = multiple
    ? multiSelected.length > 0
      ? multiSelected.map((m) => m.label).join(', ')
      : placeholder
    : singleSelected
      ? singleSelected.label
      : placeholder;

  return (
    <View className={twMerge('mb-4', className)}>
      {label && (
        <Text className="mb-1 text-sm font-medium text-gray-700">
          {label}
          {required && <Text className="text-error-500"> *</Text>}
        </Text>
      )}

      <Pressable
        onPress={() => !disabled && setOpen(true)}
        disabled={disabled}
        className={twMerge(
          'flex-row items-center rounded-lg border bg-white px-4 py-3',
          error ? 'border-error-500' : 'border-gray-300',
          disabled ? 'bg-gray-100 opacity-50' : '',
        )}
      >
        <Text
          className={twMerge(
            'flex-1 text-base',
            singleSelected || multiSelected.length > 0 ? 'text-gray-900' : 'text-gray-400',
          )}
          numberOfLines={1}
        >
          {displayText}
        </Text>
        <Text className="ml-2 text-gray-400">{'\u25BC'}</Text>
      </Pressable>

      {error && (
        <Text className="mt-1 text-xs text-error-500">{error}</Text>
      )}

      <Modal visible={open} onClose={() => setOpen(false)} title={label ?? placeholder} size="full">
        {searchable && (
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar..."
            className="mb-2 -mx-2"
          />
        )}

        {multiple && multiSelected.length > 0 && (
          <View className="mb-3 flex-row flex-wrap gap-2">
            {multiSelected.map((item) => (
              <Chip
                key={item.value}
                label={item.label}
                selected
                closable
                onClose={() => onSelect(item.value)}
              />
            ))}
          </View>
        )}

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.value}
          style={{ maxHeight: 400 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
          renderItem={({ item }) => {
            const isSelected = multiple
              ? selectedValues?.includes(item.value)
              : selectedValue === item.value;

            return (
              <Pressable
                onPress={() => {
                  onSelect(item.value);
                  if (!multiple) {
                    setOpen(false);
                  }
                }}
                className={twMerge(
                  'flex-row items-center rounded-lg px-4 py-3',
                  isSelected ? 'bg-primary-50' : 'active:bg-gray-50',
                )}
              >
                <Text
                  className={twMerge(
                    'flex-1 text-base',
                    isSelected ? 'font-semibold text-primary-700' : 'text-gray-900',
                  )}
                >
                  {item.label}
                </Text>
                {isSelected && (
                  <Text className="text-primary-500">{'\u2713'}</Text>
                )}
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <Text className="py-8 text-center text-sm text-gray-400">
              Sin resultados
            </Text>
          }
        />
      </Modal>
    </View>
  );
}
