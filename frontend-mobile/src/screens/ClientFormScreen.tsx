import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Service } from '../types';
import api, { setStoredToken } from '../services/api';
import { setOrderData } from '../services/orderStore';

type Props = NativeStackScreenProps<RootStackParamList, 'ClientForm'>;

type Step = 'form' | 'otp';

export default function ClientFormScreen({ navigation }: Props) {
  const [step, setStep] = useState<Step>('form');
  const [loading, setLoading] = useState(false);

  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/services').then((res) => setServices(res.data)).catch(() => {});
  }, []);

  const handleSendOtp = async () => {
    setError('');
    if (!name.trim() || !phone.trim() || !address.trim() || !selectedService || !scheduledAt.trim()) {
      setError('Completa todos los campos');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/send-otp', { phone: phone.trim() });
      setStep('otp');
    } catch {
      setError('Error al enviar el código');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    if (!selectedService) return;
    if (otpCode.length !== 6) {
      setError('El código debe tener 6 dígitos');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/verify', { phone: phone.trim(), code: otpCode });
      setStoredToken(res.data.token);

      setOrderData({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        scheduledAt: scheduledAt.trim(),
        serviceId: selectedService.id,
      });

      navigation.navigate('ProviderList', {
        serviceId: selectedService.id,
        client: { name: name.trim(), phone: phone.trim(), address: address.trim() },
      });
    } catch {
      setError('Código incorrecto o expirado');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'otp') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verifica tu teléfono</Text>
        <Text style={styles.subtitle}>Enviamos un código a {phone}</Text>

        <TextInput
          style={styles.input}
          placeholder="Código de 6 dígitos"
          keyboardType="number-pad"
          maxLength={6}
          value={otpCode}
          onChangeText={setOtpCode}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleVerifyOtp} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verificar</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { setStep('form'); setOtpCode(''); setError(''); }}>
          <Text style={styles.link}>Cambiar número</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
      <Text style={styles.title}>Tus datos</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput style={styles.input} placeholder="Tu nombre" value={name} onChangeText={setName} />

      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        placeholder="+521234567890"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <Text style={styles.label}>Dirección</Text>
      <TextInput style={styles.input} placeholder="Calle, número, colonia" value={address} onChangeText={setAddress} />

      <Text style={styles.label}>Fecha y hora</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD HH:mm"
        value={scheduledAt}
        onChangeText={setScheduledAt}
      />

      <Text style={styles.label}>Servicio</Text>
      {services.map((svc) => (
        <TouchableOpacity
          key={svc.id}
          style={[styles.serviceCard, selectedService?.id === svc.id && styles.serviceCardSelected]}
          onPress={() => setSelectedService(svc)}
        >
          <Text style={styles.serviceName}>{svc.name}</Text>
          <Text style={styles.servicePrice}>${svc.price.toLocaleString()}</Text>
        </TouchableOpacity>
      ))}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSendOtp} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Continuar</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#1a1a1a' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginTop: 16, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 },
  serviceCard: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 16, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' },
  serviceCardSelected: { borderColor: '#4CAF50', backgroundColor: '#f0faf0' },
  serviceName: { fontSize: 16, fontWeight: '500' },
  servicePrice: { fontSize: 16, fontWeight: '700', color: '#4CAF50' },
  button: { backgroundColor: '#4CAF50', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  error: { color: '#e53935', marginTop: 8, textAlign: 'center' },
  link: { color: '#1976D2', textAlign: 'center', marginTop: 16 },
});
