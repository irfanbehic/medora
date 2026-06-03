import { useEffect, useMemo, useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Screen, SearchBar, Text, EmptyState, ErrorState, AnimatedPressable } from '@/components';
import { CategoryFilterRow } from '@/features/providers/components/CategoryFilterRow';
import { ProviderCard } from '@/features/providers/components/ProviderCard';
import { ProviderListSkeleton } from '@/features/providers/components/ProviderCardSkeleton';
import { useProviders } from '@/features/providers/hooks/useProviders';
import type { CategoryId, Provider } from '@/features/providers/types';
import { useFilterStore } from '@/features/filter/store';
import { useDebouncedValue } from '@/lib/useDebouncedValue';
import { useTheme } from '@/theme';

const HERO_HEIGHT = 64;

export default function DiscoverScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, spacing } = useTheme();

  const countryCode = useFilterStore((s) => s.countryCode);
  const city = useFilterStore((s) => s.city);
  const categories = useFilterStore((s) => s.categories);
  const applyFilters = useFilterStore((s) => s.applyFilters);
  const activeCount = useFilterStore((s) => s.activeCount());
  const commitRecentSearch = useFilterStore((s) => s.commitRecentSearch);
  const setSearch = useFilterStore((s) => s.setSearch);

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 250);

  // Mirror the debounced term into the store so the filter modal can show an
  // accurate "Show N results" count that accounts for the active search.
  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  const filters = useMemo(
    () => ({ search: debouncedSearch, countryCode, city, categories }),
    [debouncedSearch, countryCode, city, categories],
  );

  const { data, isLoading, isError, refetch, isRefetching } = useProviders(filters);

  // Quick-filter row mirrors the (possibly multi-select) category facet.
  const selectedCategory: CategoryId | null = categories.length === 1 ? categories[0] : null;
  const onSelectCategory = (category: CategoryId | null) => {
    applyFilters({ countryCode, city, categories: category ? [category] : [] });
  };

  // Drive the collapsing hero from the list's scroll position.
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  const heroStyle = useAnimatedStyle(() => ({
    height: interpolate(scrollY.value, [0, HERO_HEIGHT], [HERO_HEIGHT, 0], 'clamp'),
    opacity: interpolate(scrollY.value, [0, HERO_HEIGHT * 0.7], [1, 0], 'clamp'),
    transform: [
      { translateY: interpolate(scrollY.value, [0, HERO_HEIGHT], [0, -12], 'clamp') },
    ],
  }));

  const resultCount = data?.length ?? 0;

  return (
    <Screen edges={['top', 'left', 'right']} backdrop>
      <Animated.View style={[styles.hero, { paddingHorizontal: spacing.lg }, heroStyle]}>
        <Text variant="display">{t('list.title')}</Text>
        <Text variant="body" color="textMuted">
          {t('list.subtitle')}
        </Text>
      </Animated.View>

      <View style={[styles.searchRow, { paddingHorizontal: spacing.lg, gap: spacing.sm }]}>
        <View style={{ flex: 1 }}>
          <SearchBar
            value={searchInput}
            onChangeText={setSearchInput}
            placeholder={t('list.searchPlaceholder')}
            onSubmitEditing={() => commitRecentSearch(searchInput)}
          />
        </View>
        <AnimatedPressable
          haptic="impact"
          onPress={() => router.push('/filter')}
          accessibilityRole="button"
          accessibilityLabel={t('filter.title')}
          style={[
            styles.filterButton,
            { backgroundColor: activeCount > 0 ? colors.brand : colors.surface, borderColor: colors.border },
          ]}
        >
          <MaterialCommunityIcons
            name="tune-variant"
            size={22}
            color={activeCount > 0 ? colors.onBrand : colors.text}
          />
          {activeCount > 0 ? (
            <View style={[styles.badge, { backgroundColor: colors.accent }]}>
              <Text variant="label" style={{ color: '#0F172A', fontSize: 10 }}>
                {activeCount}
              </Text>
            </View>
          ) : null}
        </AnimatedPressable>
      </View>

      <View style={{ marginTop: spacing.md }}>
        <CategoryFilterRow selected={selectedCategory} onSelect={onSelectCategory} />
      </View>

      {!isLoading && !isError ? (
        <View style={[styles.countRow, { paddingHorizontal: spacing.lg }]}>
          <Text variant="caption" color="textMuted">
            {t('list.results', { count: resultCount })}
          </Text>
        </View>
      ) : null}

      {isLoading ? (
        <ProviderListSkeleton />
      ) : isError ? (
        <ErrorState
          title={t('list.errorTitle')}
          body={t('list.errorBody')}
          retryLabel={t('common.retry')}
          onRetry={() => refetch()}
        />
      ) : resultCount === 0 ? (
        <EmptyState
          title={t('list.emptyTitle')}
          body={t('list.emptyBody')}
          actionLabel={activeCount > 0 ? t('list.clearFilters') : undefined}
          onAction={activeCount > 0 ? () => applyFilters({ countryCode: null, city: null, categories: [] }) : undefined}
        />
      ) : (
        <Animated.FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: Provider; index: number }) => (
            <ProviderCard provider={item} />
          )}
          onScroll={onScroll}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.sm,
            paddingBottom: spacing.xxl,
            gap: spacing.md,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.brand}
            />
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { justifyContent: 'center', overflow: 'hidden' },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  countRow: { paddingVertical: 8 },
});
