import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Provider } from '../types';
import api from '../services/api';
import { getOrderData } from '../services/orderStore';

type Props = NativeStackScreenProps<RootStackParamList, 'ProviderList'>;

export default function ProviderListScreen({ navigation, route }: Props) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const { serviceId } = route.params;

  useEffect(() => {
    setBooking(false);
    api.get('/providers', { params: { serviceId } })
      .then((res) => setProviders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [serviceId]);

  const handleSelect = async (provider: Provider) => {
    setBooking(true);
    try {
      const order = getOrderData();
      const res = await api.post('/bookings', {
        providerId: provider.id,
        serviceId,
        scheduledAt: order?.scheduledAt ?? new Date().toISOString(),
        address: order?.address ?? '',
        notes: order?.notes,
      });
      navigation.replace('Success', { bookingId: res.data.id });
    } catch (err) {
      const error = err as { response?: { data?: { message?: string | string[] } } };
      const msg = typeof error.response?.data?.message === 'string'
        ? error.response.data.message
        : error.response?.data?.message?.[0] || 'Error al crear la reserva';
      Alert.alert('Error', msg);
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (providers.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No hay proveedores disponibles para este servicio</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{ padding: 24 }}
      data={providers}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.providerName}>{item.name}</Text>
            <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}</Text>
          </View>
          {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
          <View style={styles.servicesRow}>
            {item.services.map((ps) => (
              <View key={ps.serviceId} style={styles.serviceBadge}>
                <Text style={styles.serviceBadgeText}>{ps.service.name}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={[styles.selectButton, booking && styles.disabled]}
            onPress={() => handleSelect(item)}
            disabled={booking}
          >
            {booking ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.selectButtonText}>Seleccionar</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  emptyText: { fontSize: 16, color: '#666' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  providerName: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a' },
  rating: { fontSize: 14, color: '#666' },
  description: { fontSize: 14, color: '#555', marginBottom: 12 },
  servicesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  serviceBadge: { backgroundColor: '#E8F5E9', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  serviceBadgeText: { fontSize: 12, color: '#2E7D32' },
  selectButton: { backgroundColor: '#4CAF50', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  disabled: { opacity: 0.6 },
  selectButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
