import { Redirect, useSegments } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { Loader } from '@/components/ui';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const segments = useSegments();

  if (isLoading) {
    return (
      <Loader
        variant="spinner"
        size="large"
        text="Cargando..."
        fullScreen
      />
    );
  }

  const isAuthRoute = segments[0] === '(auth)';

  if (!isAuthenticated && !isAuthRoute) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (isAuthenticated && isAuthRoute) {
    return <Redirect href="/(tabs)" />;
  }

  return <>{children}</>;
}
