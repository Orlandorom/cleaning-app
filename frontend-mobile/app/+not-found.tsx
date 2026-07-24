import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-2">
        404
      </Text>
      <Text className="text-base text-gray-500 mb-6 text-center">
        Esta página no existe
      </Text>
      <Link href="/(tabs)" className="text-primary-500 text-base font-semibold">
        Volver al inicio
      </Link>
    </View>
  );
}
