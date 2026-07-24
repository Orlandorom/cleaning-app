import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center bg-white px-6">
          <Text className="mb-2 text-xl font-bold text-gray-900">
            Algo salió mal
          </Text>
          <Text className="mb-6 text-center text-sm text-gray-500">
            Ocurrió un error inesperado. Por favor intenta de nuevo.
          </Text>
          <Button title="Reintentar" onPress={this.handleReset} variant="primary" />
        </View>
      );
    }

    return this.props.children;
  }
}
