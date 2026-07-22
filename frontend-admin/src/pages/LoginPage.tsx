import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/', { replace: true });
    } catch {
      setError('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h1 style={styles.title}>Panel Administrativo</h1>
        <p style={styles.subtitle}>Ingresa para gestionar el sistema</p>

        <input
          style={styles.input}
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error ? <p style={styles.error}>{error}</p> : null}

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#1a1a2e' },
  card: { backgroundColor: '#fff', padding: 40, borderRadius: 12, width: 360, boxShadow: '0 4px 24px rgba(0,0,0,0.15)' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4, color: '#1a1a1a' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 24 },
  input: { width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: 15, marginBottom: 16, boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px 16px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer' },
  error: { color: '#e53935', fontSize: 14, marginBottom: 12, textAlign: 'center' },
};
