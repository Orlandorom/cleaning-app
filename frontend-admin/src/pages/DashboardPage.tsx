import { useQuery } from '@tanstack/react-query';
import api from '../api';

export default function DashboardPage() {
  const { data: providers } = useQuery({
    queryKey: ['providers'],
    queryFn: () => api.get('/providers').then((r) => r.data),
  });

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/services').then((r) => r.data),
  });

  const stats = [
    { label: 'Proveedores activos', value: providers?.length ?? 0, color: '#4CAF50' },
    { label: 'Servicios disponibles', value: services?.length ?? 0, color: '#2196F3' },
  ];

  return (
    <div>
      <h1 style={styles.pageTitle}>Dashboard</h1>
      <div style={styles.grid}>
        {stats.map((s) => (
          <div key={s.label} style={{ ...styles.card, borderLeft: `4px solid ${s.color}` }}>
            <p style={styles.cardValue}>{s.value}</p>
            <p style={styles.cardLabel}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pageTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: '#1a1a1a' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 },
  card: { backgroundColor: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  cardValue: { fontSize: 36, fontWeight: 'bold', color: '#1a1a1a', margin: 0 },
  cardLabel: { fontSize: 14, color: '#666', margin: '4px 0 0' },
};
