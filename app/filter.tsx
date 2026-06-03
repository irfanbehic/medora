import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { AnimatedPressable, Button, Chip, Text } from '@/components';
import { CATEGORIES, COUNTRIES, getCitiesForCountry } from '@/data/taxonomy';
import { filterProviders } from '@/features/providers/api/mockApi';
import { PROVIDERS } from '@/data/providers';
import { useFilterStore } from '@/features/filter/store';
import type { CategoryId } from '@/features/providers/types';
import { haptics } from '@/lib/haptics';
import { useTheme } from '@/theme';

export default function FilterModal() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();

  const search = useFilterStore((s) => s.search);
  const appliedCountry = useFilterStore((s) => s.countryCode);
  const appliedCity = useFilterStore((s) => s.city);
  const appliedCategories = useFilterStore((s) => s.categories);
  const applyFilters = useFilterStore((s) => s.applyFilters);

  const [countryCode, setCountryCode] = useState(appliedCountry);
  const [city, setCity] = useState(appliedCity);
  const [categories, setCategories] = useState<CategoryId[]>(appliedCategories);

  const cities = getCitiesForCountry(countryCode);

  const liveCount = useMemo(
    () =>
      filterProviders(PROVIDERS, { search, countryCode, city, categories }).length,
    [search, countryCode, city, categories],
  );

  const selectCountry = (code: string | null) => {
    setCountryCode(code);
    
    if (!code || !getCitiesForCountry(code).includes(city ?? '')) {
      setCity(null);
    }
  };

  const toggleCategory = (id: CategoryId) => {
    setCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const clearAll = () => {
    haptics.selection();
    setCountryCode(null);
    setCity(null);
    setCategories([]);
  };

  const confirm = () => {
    haptics.success();
    applyFilters({ countryCode, city, categories });
    router.back();
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: spacing.lg, borderBottomColor: colors.border }]}>
        <Text variant="heading">{t('filter.title')}</Text>
        <View style={styles.headerActions}>
          <AnimatedPressable haptic="selection" onPress={clearAll} hitSlop={8}>
            <Text variant="bodyStrong" color="brand">
              {t('filter.clearAll')}
            </Text>
          </AnimatedPressable>
          <AnimatedPressable
            haptic="selection"
            onPress={() => router.back()}
            hitSlop={8}
            accessibilityLabel={t('common.cancel')}
            style={[styles.closeBtn, { backgroundColor: colors.surfaceAlt }]}
          >
            <MaterialCommunityIcons name="close" size={18} color={colors.text} />
          </AnimatedPressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <Section title={t('filter.country')}>
          <View style={styles.wrap}>
            <Chip
              label={t('filter.anyCountry')}
              selected={countryCode == null}
              onPress={() => selectCountry(null)}
            />
            {COUNTRIES.map((c) => (
              <Chip
                key={c.code}
                label={`${c.flag}  ${c.name}`}
                selected={countryCode === c.code}
                onPress={() => selectCountry(countryCode === c.code ? null : c.code)}
              />
            ))}
          </View>
        </Section>

        <Section title={t('filter.city')}>
          {countryCode == null ? (
            <Text variant="caption" color="textSubtle">
              {t('filter.selectCountryFirst')}
            </Text>
          ) : (
            <View style={styles.wrap}>
              <Chip
                label={t('filter.anyCity')}
                selected={city == null}
                onPress={() => setCity(null)}
              />
              {cities.map((cityName) => (
                <Chip
                  key={cityName}
                  label={cityName}
                  selected={city === cityName}
                  onPress={() => setCity(city === cityName ? null : cityName)}
                />
              ))}
            </View>
          )}
        </Section>

        <Section title={t('filter.category')}>
          <View style={styles.wrap}>
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat.id}
                label={t(`categories.${cat.id}`)}
                icon={cat.icon as never}
                accent={cat.color}
                selected={categories.includes(cat.id)}
                onPress={() => toggleCategory(cat.id)}
              />
            ))}
          </View>
        </Section>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, borderTopColor: colors.border, backgroundColor: colors.background },
        ]}
      >
        <Button
          title={
            liveCount > 0
              ? t('filter.showResults', { count: liveCount })
              : t('filter.noResults')
          }
          onPress={confirm}
          disabled={liveCount === 0}
        />
      </View>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { spacing } = useTheme();
  return (
    <View style={{ gap: spacing.md }}>
      <Text variant="subheading">{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  footer: {
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
