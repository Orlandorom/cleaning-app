import { type ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';

export function SessionProvider({ children }: { children: ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, []);

  return <>{children}</>;
}
