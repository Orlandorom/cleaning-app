import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { clearOrderData } from '../services/orderStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const handleStart = () => {
    clearOrderData();
    navigation.navigate('ClientForm');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🧹</Text>
      <Text style={styles.title}>Servicios de Aseo</Text>
      <Text style={styles.subtitle}>
        Encuentra profesionales de limpieza confiables cerca de ti
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Solicitar servicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  icon: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 12, color: '#1a1a1a' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40, lineHeight: 24 },
  button: { backgroundColor: '#4CAF50', paddingVertical: 16, paddingHorizontal: 48, borderRadius: 12 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
