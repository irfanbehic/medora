import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { Text } from '@/components/Text';
import { formatLocation } from '@/lib/format';
import { haptics } from '@/lib/haptics';
import { getCategoryMeta, getCountry } from '@/data/taxonomy';
import { useTheme } from '@/theme';
import { ProviderAvatar } from './ProviderAvatar';
import { RatingStars } from './RatingStars';
import { VerifiedBadge } from './VerifiedBadge';
import { useSavedStore } from '../store/savedStore';
import type { Provider } from '../types';

type Props = { provider: Provider };

function ProviderCardBase({ provider }: Props) {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, spacing, radius, elevation } = useTheme();

  const category = getCategoryMeta(provider.category);
  const country = getCountry(provider.countryCode);
  const saved = useSavedStore((s) => s.ids.includes(provider.id));
  const toggleSaved = useSavedStore((s) => s.toggle);

  return (
    <AnimatedPressable
      onPress={() => router.push(`/provider/${provider.id}`)}
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={provider.name}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.lg,
          padding: spacing.md,
          gap: spacing.md,
          shadowOpacity: 0.06,
          shadowRadius: elevation.md,
          shadowOffset: { width: 0, height: 4 },
          shadowColor: '#000',
        },
      ]}
    >
      <ProviderAvatar provider={provider} size={68} radius={radius.md} />

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text variant="subheading" numberOfLines={1} style={styles.name}>
            {provider.name}
          </Text>
          {provider.verified ? <VerifiedBadge size={16} /> : null}
        </View>

        <View style={[styles.metaRow, { marginTop: 2 }]}>
          <MaterialCommunityIcons
            name={category.icon as keyof typeof MaterialCommunityIcons.glyphMap}
            size={13}
            color={category.color}
          />
          <Text variant="caption" style={{ color: category.color, marginLeft: spacing.xs }}>
            {t(`categories.${provider.category}`)}
          </Text>
          <Text variant="caption" color="textSubtle" style={{ marginHorizontal: spacing.xs }}>
            •
          </Text>
          <Text variant="caption" color="textMuted">
            {t(`kinds.${provider.kind}`)}
          </Text>
        </View>

        <View style={[styles.metaRow, { marginTop: spacing.xs }]}>
          <MaterialCommunityIcons name="map-marker-outline" size={13} color={colors.textSubtle} />
          <Text variant="caption" color="textMuted" numberOfLines={1} style={{ marginLeft: 2 }}>
            {formatLocation(provider.city, country?.name) || '—'}
          </Text>
        </View>

        <View style={{ marginTop: spacing.sm }}>
          <RatingStars rating={provider.rating} reviewCount={provider.reviewCount} />
        </View>
      </View>

      <AnimatedPressable
        haptic="none"
        hitSlop={10}
        onPress={() => {
          haptics.selection();
          toggleSaved(provider.id);
        }}
        accessibilityRole="button"
        accessibilityLabel={saved ? 'Remove from saved' : 'Save provider'}
        style={styles.saveButton}
      >
        <MaterialCommunityIcons
          name={saved ? 'heart' : 'heart-outline'}
          size={22}
          color={saved ? colors.danger : colors.textSubtle}
        />
      </AnimatedPressable>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  body: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { flexShrink: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  saveButton: { padding: 4, alignSelf: 'flex-start' },
});

export const ProviderCard = memo(ProviderCardBase);
