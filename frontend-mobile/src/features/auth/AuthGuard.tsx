import { Redirect, useSegments } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token, isHydrated } = useAuth();
  const segments = useSegments();

  if (!isHydrated) {
    return <Spinner size="large" className="flex-1" />;
  }

  const isAuthRoute = segments[0] === '(auth)';

  if (!token && !isAuthRoute) {
    return <Redirect href="/(auth)/login" />;
  }

  if (token && isAuthRoute) {
    return <Redirect href="/(tabs)" />;
  }

  return <>{children}</>;
}
