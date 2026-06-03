import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  onboardingSeen: 'medora.onboardingSeen',
  themeMode: 'medora.themeMode',
  locale: 'medora.locale',
  savedProviderIds: 'medora.savedProviderIds',
  recentSearches: 'medora.recentSearches',
} as const;

export async function getItem(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
}

export async function setItem(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    
  }
}

export async function getJSON<T>(key: string, fallback: T): Promise<T> {
  const raw = await getItem(key);
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function setJSON<T>(key: string, value: T): Promise<void> {
  await setItem(key, JSON.stringify(value));
}
