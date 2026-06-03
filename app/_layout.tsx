import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

import '@/i18n';
import { OfflineBanner } from '@/components';
import { bindOnlineManager, queryClient } from '@/lib/queryClient';
import { getItem, StorageKeys } from '@/lib/storage';
import { getProviders } from '@/features/providers/api/mockApi';
import { providerKeys } from '@/features/providers/hooks/useProviders';
import { useFilterStore } from '@/features/filter/store';
import { useSavedStore } from '@/features/providers/store/savedStore';
import { useSettings } from '@/store/settings';
import { ThemeProvider, useTheme } from '@/theme';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <RootNavigator />
            <OfflineBanner />
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const router = useRouter();
  const theme = useTheme();
  const { i18n } = useTranslation();
  const [ready, setReady] = useState(false);

  const hydrateSettings = useSettings((s) => s.hydrate);
  const hydrateSaved = useSavedStore((s) => s.hydrate);
  const hydrateFilters = useFilterStore((s) => s.hydrate);
  const locale = useSettings((s) => s.locale);

  useEffect(() => {
    bindOnlineManager();
    const initialFilters = { search: '', countryCode: null, city: null, categories: [] };
    (async () => {
      await Promise.all([
        hydrateSettings(),
        hydrateSaved(),
        hydrateFilters(),
        // Warm the default list so it's already cached when the user lands on
        
        queryClient.prefetchQuery({
          queryKey: providerKeys.list(initialFilters),
          queryFn: () => getProviders(initialFilters),
        }),
      ]);
      const seen = await getItem(StorageKeys.onboardingSeen);
      if (!seen) router.replace('/onboarding');
      setReady(true);
    })();
  }, [hydrateSettings, hydrateSaved, hydrateFilters, router]);

  useEffect(() => {
    if (i18n.language !== locale) void i18n.changeLanguage(locale);
  }, [locale, i18n]);

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  return (
    <>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="provider/[id]" />
        <Stack.Screen
          name="filter"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
      </Stack>
    </>
  );
}
