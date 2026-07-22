import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import type { Provider } from '../types';

export default function ProvidersPage() {
  const [search, setSearch] = useState('');

  const { data: providers = [], isLoading } = useQuery({
    queryKey: ['providers', search],
    queryFn: () => api.get('/providers', { params: { search: search || undefined } }).then((r) => r.data),
  });

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Proveedores</h1>
      </div>

      <input
        style={styles.searchInput}
        placeholder="Buscar proveedor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading ? <p>Cargando...</p> : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Teléfono</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Rating</th>
              <th style={styles.th}>Disponible</th>
              <th style={styles.th}>Servicios</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p: Provider) => (
              <tr key={p.id}>
                <td style={styles.td}>{p.name}</td>
                <td style={styles.td}>{p.phone}</td>
                <td style={styles.td}>{p.email ?? '-'}</td>
                <td style={styles.td}>⭐ {p.rating.toFixed(1)}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, backgroundColor: p.isAvailable ? '#4CAF50' : '#e53935' }}>
                    {p.isAvailable ? 'Sí' : 'No'}
                  </span>
                </td>
                <td style={styles.td}>
                  {p.services.map((ps) => ps.service.name).join(', ')}
                </td>
              </tr>
            ))}
            {providers.length === 0 && (
              <tr><td colSpan={6} style={{ ...styles.td, textAlign: 'center' }}>Sin proveedores</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a', margin: 0 },
  searchInput: { width: '100%', padding: '10px 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: 15, marginBottom: 16, boxSizing: 'border-box' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  th: { textAlign: 'left', padding: '12px 16px', backgroundColor: '#f9f9f9', fontSize: 13, fontWeight: 600, color: '#666', borderBottom: '1px solid #eee' },
  td: { padding: '12px 16px', fontSize: 14, borderBottom: '1px solid #eee', color: '#333' },
  badge: { padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, color: '#fff' },
};
