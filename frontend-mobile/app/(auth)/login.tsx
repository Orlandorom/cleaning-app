import { useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Input } from '@/components/ui';
import { useSendOtp } from '@/hooks/useAuthMutation';
import { phoneSchema } from '@/utils/validation';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const sendOtp = useSendOtp();

  const handleSendCode = async () => {
    setError('');

    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    sendOtp.mutate(phone, {
      onSuccess: () => {
        router.push(`/(auth)/otp?phone=${encodeURIComponent(phone)}`);
      },
    });
  };

  return (
    <View className="flex-1 bg-white px-6">
      <View className="flex-1 justify-center">
        <Text className="mb-2 text-2xl font-bold text-gray-900">
          Iniciar sesión
        </Text>
        <Text className="mb-8 text-base text-gray-500">
          Ingresa tu número de teléfono para recibir un código de verificación
        </Text>

        <Input
          label="Número de teléfono"
          value={phone}
          onChangeText={(t) => {
            setPhone(t);
            setError('');
          }}
          placeholder="+573001234567"
          keyboardType="phone-pad"
          autoCapitalize="none"
          error={error}
          helperText="Incluye código de país (ej: +57 para Colombia)"
        />
      </View>

      <View className="pb-12">
        <Button
          title="Enviar código"
          size="lg"
          fullWidth
          loading={sendOtp.isPending}
          onPress={handleSendCode}
        />
      </View>
    </View>
  );
}
