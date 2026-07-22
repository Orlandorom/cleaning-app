import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import type { RootStackParamList } from './src/types';
import HomeScreen from './src/screens/HomeScreen';
import ClientFormScreen from './src/screens/ClientFormScreen';
import ProviderListScreen from './src/screens/ProviderListScreen';
import SuccessScreen from './src/screens/SuccessScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerBackTitle: 'Atrás' }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Inicio' }}
        />
        <Stack.Screen
          name="ClientForm"
          component={ClientFormScreen}
          options={{ title: 'Tus datos' }}
        />
        <Stack.Screen
          name="ProviderList"
          component={ProviderListScreen}
          options={{ title: 'Proveedores' }}
        />
        <Stack.Screen
          name="Success"
          component={SuccessScreen}
          options={{ title: 'Confirmación', headerBackVisible: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
