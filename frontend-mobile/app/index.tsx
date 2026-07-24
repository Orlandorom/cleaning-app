import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';

export default function SplashScreen() {
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-primary-500">
        <View className="h-20 w-20 items-center justify-center rounded-2xl bg-white/20">
          <Text className="text-4xl font-bold text-white">CL</Text>
        </View>
        <Text className="mt-4 text-2xl font-bold text-white">CleanApp</Text>
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
