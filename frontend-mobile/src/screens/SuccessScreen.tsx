import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Booking } from '../types';
import api from '../services/api';
import { clearOrderData } from '../services/orderStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Success'>;

export default function SuccessScreen({ navigation, route }: Props) {
  const { bookingId } = route.params;
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    api.get(`/bookings/${bookingId}`)
      .then((res) => setBooking(res.data))
      .catch(() => {});
  }, [bookingId]);

  const handleGoHome = () => {
    clearOrderData();
    navigation.popToTop();
  };

  if (!booking) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.checkmark}>✓</Text>
      <Text style={styles.title}>¡Solicitud enviada!</Text>
      <Text style={styles.subtitle}>Tu reserva está pendiente de confirmación</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resumen</Text>
        <View style={styles.row}>
          <Text style={styles.label}>ID:</Text>
          <Text style={styles.value}>{booking.id.slice(0, 8)}...</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Servicio:</Text>
          <Text style={styles.value}>{booking.service?.name ?? '-'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Proveedor:</Text>
          <Text style={styles.value}>{booking.provider?.name ?? '-'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Fecha:</Text>
          <Text style={styles.value}>{new Date(booking.scheduledAt).toLocaleDateString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total:</Text>
          <Text style={styles.value}>${booking.totalPrice.toLocaleString()}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleGoHome}>
        <Text style={styles.buttonText}>Volver al inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', padding: 24 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  checkmark: { fontSize: 72, color: '#4CAF50', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 32 },
  card: { width: '100%', backgroundColor: '#f9f9f9', borderRadius: 12, padding: 20, marginBottom: 32 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#1a1a1a' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  label: { fontSize: 14, color: '#888' },
  value: { fontSize: 14, fontWeight: '600', color: '#333' },
  button: { backgroundColor: '#4CAF50', paddingVertical: 16, paddingHorizontal: 48, borderRadius: 12 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
