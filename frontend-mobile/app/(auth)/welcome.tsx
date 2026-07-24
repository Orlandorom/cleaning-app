import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-6 h-24 w-24 items-center justify-center rounded-3xl bg-primary-500">
          <Text className="text-5xl font-bold text-white">CL</Text>
        </View>
        <Text className="mb-2 text-3xl font-bold text-gray-900">
          CleanApp
        </Text>
        <Text className="mb-8 text-center text-base text-gray-500">
          Servicio de limpieza profesional{'\n'}a domicilio
        </Text>
      </View>

      <View className="px-6 pb-12">
        <Button
          title="Iniciar sesión"
          size="lg"
          fullWidth
          onPress={() => router.push('/(auth)/login')}
        />
      </View>
    </View>
  );
}
