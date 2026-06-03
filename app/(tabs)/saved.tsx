import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { Screen, Text, EmptyState } from '@/components';
import { ProviderCard } from '@/features/providers/components/ProviderCard';
import { useSavedStore } from '@/features/providers/store/savedStore';
import { PROVIDERS } from '@/data/providers';
import { useTheme } from '@/theme';

export default function SavedScreen() {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const ids = useSavedStore((s) => s.ids);

  const saved = useMemo(
    () => ids.map((id) => PROVIDERS.find((p) => p.id === id)).filter(Boolean),
    [ids],
  );

  return (
    <Screen backdrop>
      <View style={[styles.header, { paddingHorizontal: spacing.lg }]}>
        <Text variant="display">{t('saved.title')}</Text>
      </View>

      {saved.length === 0 ? (
        <EmptyState icon="heart-outline" title={t('saved.emptyTitle')} body={t('saved.emptyBody')} />
      ) : (
        <FlatList
          data={saved}
          keyExtractor={(item) => item!.id}
          renderItem={({ item }) => (
            <Animated.View layout={LinearTransition.springify().damping(20)}>
              <ProviderCard provider={item!} />
            </Animated.View>
          )}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.sm,
            paddingBottom: spacing.xxl,
            gap: spacing.md,
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 8, paddingBottom: 12 },
});
