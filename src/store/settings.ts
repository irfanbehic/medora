import { create } from 'zustand';
import { getItem, setItem, StorageKeys } from '@/lib/storage';

export type ThemeMode = 'system' | 'light' | 'dark';
export type Locale = 'en' | 'tr';

type SettingsState = {
  themeMode: ThemeMode;
  locale: Locale;
    hydrated: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setLocale: (locale: Locale) => void;
  hydrate: () => Promise<void>;
};

export const useSettings = create<SettingsState>((set) => ({
  themeMode: 'system',
  locale: 'en',
  hydrated: false,

  setThemeMode: (themeMode) => {
    set({ themeMode });
    void setItem(StorageKeys.themeMode, themeMode);
  },

  setLocale: (locale) => {
    set({ locale });
    void setItem(StorageKeys.locale, locale);
  },

  hydrate: async () => {
    const [themeMode, locale] = await Promise.all([
      getItem(StorageKeys.themeMode),
      getItem(StorageKeys.locale),
    ]);
    set({
      themeMode: (themeMode as ThemeMode) ?? 'system',
      locale: (locale as Locale) ?? 'en',
      hydrated: true,
    });
  },
}));
