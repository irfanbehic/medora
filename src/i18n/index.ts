import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import tr from './tr.json';

export const resources = {
  en: { translation: en },
  tr: { translation: tr },
} as const;

export type AppLocale = keyof typeof resources;

function deviceLanguage(): AppLocale {
  const code = getLocales()[0]?.languageCode;
  return code === 'tr' ? 'tr' : 'en';
}

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    lng: deviceLanguage(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    returnNull: false,
  });
}

export default i18n;
