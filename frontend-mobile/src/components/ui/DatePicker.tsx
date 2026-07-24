import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { Modal } from './Modal';

export type DatePickerMode = 'date' | 'month' | 'year';

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  mode?: DatePickerMode;
  minDate?: Date;
  maxDate?: Date;
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

interface DayPickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

function DayPicker({ value, onChange, minDate, maxDate }: DayPickerProps) {
  const [viewYear, setViewYear] = useState(value?.getFullYear() ?? new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(value?.getMonth() ?? new Date().getMonth());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const today = useMemo(() => {
    const d = new Date();
    return { y: d.getFullYear(), m: d.getMonth(), d: d.getDate() };
  }, []);

  const days = useMemo(() => {
    const result: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) result.push(null);
    for (let d = 1; d <= daysInMonth; d++) result.push(d);
    return result;
  }, [firstDayOfWeek, daysInMonth]);

  const isDisabled = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    if (minDate && date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return true;
    if (maxDate && date > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) return true;
    return false;
  };

  return (
    <View>
      <View className="mb-4 flex-row items-center justify-between">
        <Pressable
          onPress={() => {
            if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
            else setViewMonth((m) => m - 1);
          }}
          className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
        >
          <Text className="text-lg text-gray-600">{'\u25C0'}</Text>
        </Pressable>
        <Text className="text-base font-semibold text-gray-900">
          {MONTHS[viewMonth]} {viewYear}
        </Text>
        <Pressable
          onPress={() => {
            if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
            else setViewMonth((m) => m + 1);
          }}
          className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
        >
          <Text className="text-lg text-gray-600">{'\u25B6'}</Text>
        </Pressable>
      </View>

      <View className="mb-2 flex-row">
        {WEEKDAYS.map((wd) => (
          <View key={wd} className="flex-1 items-center py-1">
            <Text className="text-xs font-medium text-gray-400">{wd}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {days.map((day, i) => {
          if (day === null) return <View key={`e-${i}`} className="flex-1 p-1" />;
          const selected = value?.getDate() === day && value?.getMonth() === viewMonth && value?.getFullYear() === viewYear;
          const isToday = day === today.d && viewMonth === today.m && viewYear === today.y;
          const disabled = isDisabled(day);

          return (
            <View key={`d-${i}`} className="w-[14.28%] p-0.5">
              <Pressable
                disabled={disabled}
                onPress={() => onChange(new Date(viewYear, viewMonth, day))}
                className={twMerge(
                  'h-9 items-center justify-center rounded-full',
                  selected ? 'bg-primary-500' : disabled ? 'opacity-30' : isToday ? 'bg-primary-100' : 'active:bg-gray-100',
                )}
              >
                <Text
                  className={twMerge(
                    'text-sm',
                    selected ? 'font-bold text-white' : disabled ? 'text-gray-300' : 'text-gray-900',
                  )}
                >
                  {day}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function DatePicker({
  value,
  onChange,
  mode = 'date',
  minDate,
  maxDate,
  label,
  placeholder = 'Seleccionar fecha',
  error,
  required,
  disabled,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

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
        <Text className="mr-2 text-base text-gray-400">{'\uD83D\uDCC5'}</Text>
        <Text
          className={twMerge(
            'flex-1 text-base',
            value ? 'text-gray-900' : 'text-gray-400',
          )}
        >
          {value ? formatDate(value) : placeholder}
        </Text>
      </Pressable>

      {error && (
        <Text className="mt-1 text-xs text-error-500">{error}</Text>
      )}

      <Modal visible={open} onClose={() => setOpen(false)} title={label ?? 'Seleccionar fecha'}>
        <DayPicker
          value={value}
          onChange={(date) => {
            onChange?.(date);
            setOpen(false);
          }}
          minDate={minDate}
          maxDate={maxDate}
        />
      </Modal>
    </View>
  );
}
