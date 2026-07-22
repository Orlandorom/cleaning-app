import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import type { Booking, BookingStatus } from '../types';

const STATUS_COLORS: Record<BookingStatus, string> = {
  PENDING: '#FF9800',
  CONFIRMED: '#2196F3',
  IN_PROGRESS: '#9C27B0',
  COMPLETED: '#4CAF50',
  CANCELLED: '#e53935',
};

export default function BookingsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<BookingStatus | ''>('');

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => api.get('/bookings').then((r) => r.data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      api.patch(`/bookings/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });

  const filtered = filter ? bookings.filter((b: Booking) => b.status === filter) : bookings;

  return (
    <div>
      <h1 style={styles.pageTitle}>Reservas</h1>

      <select style={styles.select} value={filter} onChange={(e) => setFilter(e.target.value as BookingStatus | '')}>
        <option value="">Todos los estados</option>
        <option value="PENDING">Pendiente</option>
        <option value="CONFIRMED">Confirmada</option>
        <option value="IN_PROGRESS">En progreso</option>
        <option value="COMPLETED">Completada</option>
        <option value="CANCELLED">Cancelada</option>
      </select>

      {isLoading ? <p>Cargando...</p> : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Cliente</th>
              <th style={styles.th}>Proveedor</th>
              <th style={styles.th}>Servicio</th>
              <th style={styles.th}>Estado</th>
              <th style={styles.th}>Fecha</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b: Booking) => (
              <tr key={b.id}>
                <td style={styles.td}>{b.id.slice(0, 8)}...</td>
                <td style={styles.td}>{b.client?.name ?? '-'}</td>
                <td style={styles.td}>{b.provider?.name ?? '-'}</td>
                <td style={styles.td}>{b.service?.name ?? '-'}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, backgroundColor: STATUS_COLORS[b.status] }}>
                    {b.status}
                  </span>
                </td>
                <td style={styles.td}>{new Date(b.scheduledAt).toLocaleDateString()}</td>
                <td style={styles.td}>${b.totalPrice.toLocaleString()}</td>
                <td style={styles.td}>
                  <select
                    value={b.status}
                    onChange={(e) => updateMutation.mutate({ id: b.id, status: e.target.value as BookingStatus })}
                    style={styles.statusSelect}
                  >
                    <option value="PENDING">Pendiente</option>
                    <option value="CONFIRMED">Confirmada</option>
                    <option value="IN_PROGRESS">En progreso</option>
                    <option value="COMPLETED">Completada</option>
                    <option value="CANCELLED">Cancelada</option>
                  </select>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ ...styles.td, textAlign: 'center' }}>Sin reservas</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pageTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: '#1a1a1a' },
  select: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, marginBottom: 16 },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  th: { textAlign: 'left', padding: '12px 16px', backgroundColor: '#f9f9f9', fontSize: 13, fontWeight: 600, color: '#666', borderBottom: '1px solid #eee' },
  td: { padding: '12px 16px', fontSize: 14, borderBottom: '1px solid #eee', color: '#333' },
  badge: { padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, color: '#fff' },
  statusSelect: { padding: '4px 8px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13 },
};
