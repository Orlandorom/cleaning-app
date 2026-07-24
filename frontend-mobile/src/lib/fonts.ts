import { useFonts } from 'expo-font';

export function useLoadedFonts() {
  const [loaded] = useFonts({});
  return loaded;
}
