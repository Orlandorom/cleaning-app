import { ActivityIndicator, Modal, View } from 'react-native';
import { useLoadingStore } from '@/store/loading-store';

export function LoadingOverlay() {
  const isLoading = useLoadingStore((s) => s.isLoading);

  if (!isLoading) return null;

  return (
    <Modal transparent animationType="fade" statusBarTranslucent>
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="rounded-2xl bg-white p-8 shadow-lg">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      </View>
    </Modal>
  );
}
