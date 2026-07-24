import { useState, useCallback } from 'react';
import { Text, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button, OTPInput } from '@/components/ui';
import { useSendOtp, useLogin } from '@/hooks/useAuthMutation';

export default function OtpScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [code, setCode] = useState('');
  const login = useLogin();
  const sendOtp = useSendOtp();

  const handleVerify = useCallback(() => {
    if (code.length < 6 || !phone) return;
    login.mutate({ phone, code });
  }, [code, phone, login]);

  const handleResend = useCallback(() => {
    if (phone) {
      sendOtp.mutate(phone);
    }
  }, [phone, sendOtp]);

  return (
    <View className="flex-1 bg-white px-6">
      <View className="flex-1 justify-center">
        <Text className="mb-2 text-2xl font-bold text-gray-900">
          Verificar código
        </Text>
        <Text className="mb-8 text-base text-gray-500">
          Ingresa el código de 6 dígitos enviado a{'\n'}
          <Text className="font-semibold text-gray-700">{phone}</Text>
        </Text>

        <OTPInput
          value={code}
          onChange={setCode}
          error={login.isError ? 'Código inválido' : undefined}
          autoFocus
        />

        <View className="mt-8 items-center">
          <Text className="mb-2 text-sm text-gray-500">
            ¿No recibiste el código?
          </Text>
          <Button
            title="Reenviar código"
            variant="ghost"
            size="sm"
            loading={sendOtp.isPending}
            onPress={handleResend}
          />
        </View>
      </View>

      <View className="pb-12">
        <Button
          title="Verificar"
          size="lg"
          fullWidth
          loading={login.isPending}
          disabled={code.length < 6}
          onPress={handleVerify}
        />
      </View>
    </View>
  );
}
