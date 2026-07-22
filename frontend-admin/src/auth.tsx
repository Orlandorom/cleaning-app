import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin_token'));

  const login = useCallback(async (username: string, password: string) => {
    if (username === 'admin' && password === 'admin') {
      const fakeToken = 'admin-mock-token-' + Date.now();
      localStorage.setItem('admin_token', fakeToken);
      setToken(fakeToken);
    } else {
      throw new Error('Credenciales inválidas');
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
