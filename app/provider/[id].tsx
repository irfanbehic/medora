import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Screen, Text, AnimatedPressable, ErrorState } from '@/components';
import { ProviderAvatar } from '@/features/providers/components/ProviderAvatar';
import { RatingStars } from '@/features/providers/components/RatingStars';
import { RatingDistribution } from '@/features/providers/components/RatingDistribution';
import { VerifiedBadge } from '@/features/providers/components/VerifiedBadge';
import { StatTile } from '@/features/providers/components/StatTile';
import { ContactButton } from '@/features/providers/components/ContactButton';
import { ReviewCard } from '@/features/providers/components/ReviewCard';
import { useProvider } from '@/features/providers/hooks/useProviders';
import { useSavedStore } from '@/features/providers/store/savedStore';
import type { Provider } from '@/features/providers/types';
import { getCategoryMeta, getCountry } from '@/data/taxonomy';
import { formatCount, formatLocation, getInitials } from '@/lib/format';
import { contact } from '@/lib/linking';
import { haptics } from '@/lib/haptics';
import { useTheme } from '@/theme';

const HERO_HEIGHT = 300;

export default function ProviderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError, refetch } = useProvider(id);
  const { t } = useTranslation();
  const { colors } = useTheme();

  if (isLoading) return <DetailLoading />;
  if (isError || !data) {
    return (
      <Screen>
        <ErrorState
          title={t('list.errorTitle')}
          body={t('list.errorBody')}
          retryLabel={t('common.retry')}
          onRetry={() => refetch()}
        />
      </Screen>
    );
  }

  return <DetailContent provider={data} />;
}

function DetailContent({ provider }: { provider: Provider }) {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const { colors, spacing, radius } = useTheme();

  const category = getCategoryMeta(provider.category);
  const country = getCountry(provider.countryCode);
  const saved = useSavedStore((s) => s.ids.includes(provider.id));
  const toggleSaved = useSavedStore((s) => s.toggle);

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const heroStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [-HERO_HEIGHT, 0, HERO_HEIGHT],
          [-HERO_HEIGHT / 2, 0, HERO_HEIGHT * 0.4],
          'clamp',
        ),
      },
      { scale: interpolate(scrollY.value, [-HERO_HEIGHT, 0], [2.2, 1], 'clamp') },
    ],
  }));

  const topBarStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [HERO_HEIGHT - 140, HERO_HEIGHT - 80], [0, 1], 'clamp'),
  }));

  const hasContact =
    Boolean(provider.phone) ||
    Boolean(provider.website) ||
    Boolean(provider.email) ||
    Boolean(provider.coordinate);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.topBar, { paddingTop: insets.top + 6 }]} pointerEvents="box-none">
        <CircleButton icon="chevron-left" onPress={() => router.back()} />
        <Animated.View style={[styles.topTitle, topBarStyle]} pointerEvents="none">
          <Text variant="bodyStrong" numberOfLines={1}>
            {provider.name}
          </Text>
        </Animated.View>
        <CircleButton
          icon={saved ? 'heart' : 'heart-outline'}
          tint={saved ? colors.danger : undefined}
          onPress={() => {
            haptics.selection();
            toggleSaved(provider.id);
          }}
        />
      </View>

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}
      >
        <View style={styles.heroWrap}>
          <Animated.View style={[StyleSheet.absoluteFill, heroStyle]}>
            {provider.photo ? (
              <Image
                source={{ uri: provider.photo }}
                placeholder={provider.blurhash ? { blurhash: provider.blurhash } : undefined}
                contentFit="cover"
                transition={300}
                style={StyleSheet.absoluteFill}
              />
            ) : (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: category.color }]}>
                <View style={styles.heroInitials}>
                  <Text style={{ color: '#fff', fontSize: 72, fontWeight: '800', opacity: 0.9 }}>
                    {getInitials(provider.name)}
                  </Text>
                </View>
              </View>
            )}
          </Animated.View>
          <LinearGradient
            colors={['rgba(0,0,0,0.25)', 'transparent', 'rgba(0,0,0,0.15)']}
            style={StyleSheet.absoluteFill}
          />
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.background, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.lg, marginTop: -spacing.xl },
          ]}
        >
          <View style={styles.titleRow}>
            <Text variant="title" style={{ flex: 1 }}>
              {provider.name}
            </Text>
            {provider.verified ? <VerifiedBadge label={t('detail.verified')} /> : null}
          </View>

          <View style={[styles.metaRow, { marginTop: spacing.sm }]}>
            <MaterialCommunityIcons
              name={category.icon as keyof typeof MaterialCommunityIcons.glyphMap}
              size={16}
              color={category.color}
            />
            <Text variant="bodyStrong" style={{ color: category.color, marginLeft: 6 }}>
              {t(`categories.${provider.category}`)}
            </Text>
            <Text color="textSubtle" style={{ marginHorizontal: 6 }}>
              •
            </Text>
            <Text variant="body" color="textMuted">
              {t(`kinds.${provider.kind}`)}
            </Text>
          </View>

          <View style={[styles.metaRow, { marginTop: spacing.xs }]}>
            <MaterialCommunityIcons name="map-marker-outline" size={15} color={colors.textSubtle} />
            <Text variant="body" color="textMuted" style={{ marginLeft: 4 }}>
              {formatLocation(provider.city, country?.name) || '—'}
            </Text>
          </View>

          <View style={{ marginTop: spacing.md }}>
            <RatingStars rating={provider.rating} reviewCount={provider.reviewCount} size={16} />
          </View>

          <View style={[styles.stats, { marginTop: spacing.lg, gap: spacing.sm }]}>
            {provider.experienceYears != null ? (
              <StatTile
                icon="briefcase-outline"
                value={t('detail.years', { count: provider.experienceYears })}
                label={t('detail.experience')}
              />
            ) : null}
            {provider.patientsServed != null ? (
              <StatTile
                icon="account-group-outline"
                value={formatCount(provider.patientsServed)}
                label={t('detail.patients')}
              />
            ) : null}
            {provider.reviewCount ? (
              <StatTile
                icon="message-star-outline"
                value={formatCount(provider.reviewCount)}
                label={t('detail.reviews')}
              />
            ) : null}
          </View>

          <Section title={t('detail.contact')}>
            {hasContact ? (
              <View style={styles.contactRow}>
                {provider.phone ? (
                  <ContactButton icon="phone" label={t('detail.call')} onPress={() => contact.call(provider.phone!)} />
                ) : null}
                {provider.website ? (
                  <ContactButton icon="web" label={t('detail.website')} onPress={() => contact.web(provider.website!)} />
                ) : null}
                {provider.email ? (
                  <ContactButton icon="email-outline" label={t('detail.email')} onPress={() => contact.email(provider.email!)} />
                ) : null}
                {provider.coordinate ? (
                  <ContactButton
                    icon="directions"
                    label={t('detail.directions')}
                    onPress={() => contact.directions(provider.coordinate!.latitude, provider.coordinate!.longitude, provider.name)}
                  />
                ) : null}
              </View>
            ) : (
              <Text variant="body" color="textSubtle">
                {t('detail.noContact')}
              </Text>
            )}
          </Section>

          <Section title={t('detail.about')}>
            <Text variant="body" color={provider.bio ? 'textMuted' : 'textSubtle'} style={{ lineHeight: 22 }}>
              {provider.bio ?? t('detail.noBio')}
            </Text>
          </Section>

          {provider.languages && provider.languages.length > 0 ? (
            <Section title={t('detail.languages')}>
              <View style={styles.langWrap}>
                {provider.languages.map((lang) => (
                  <View key={lang} style={[styles.langPill, { backgroundColor: colors.surfaceAlt, borderRadius: radius.pill }]}>
                    <Text variant="caption" color="textMuted">
                      {lang}
                    </Text>
                  </View>
                ))}
              </View>
            </Section>
          ) : null}

          <Section title={t('detail.ratingsReviews')}>
            {provider.rating && provider.ratingBreakdown && provider.reviewCount ? (
              <>
                <RatingDistribution
                  breakdown={provider.ratingBreakdown}
                  average={provider.rating}
                  reviewCount={provider.reviewCount}
                />
                <Text variant="caption" color="textSubtle" style={{ marginTop: spacing.sm }}>
                  {t('detail.basedOn', { count: provider.reviewCount })}
                </Text>
                <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
                  {(provider.reviews ?? []).slice(0, 3).map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </View>
              </>
            ) : (
              <Text variant="body" color="textSubtle">
                {t('detail.notRatedYet')}
              </Text>
            )}
          </Section>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { spacing } = useTheme();
  return (
    <View style={{ marginTop: spacing.xl, gap: spacing.md }}>
      <Text variant="heading">{title}</Text>
      {children}
    </View>
  );
}

function CircleButton({
  icon,
  onPress,
  tint,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
  tint?: string;
}) {
  const { colors } = useTheme();
  return (
    <AnimatedPressable
      haptic="light"
      onPress={onPress}
      hitSlop={8}
      style={[styles.circleBtn, { backgroundColor: colors.surface }]}
      accessibilityRole="button"
    >
      <MaterialCommunityIcons name={icon} size={22} color={tint ?? colors.text} />
    </AnimatedPressable>
  );
}

function DetailLoading() {
  const { colors } = useTheme();
  return (
    <View style={[styles.loading, { backgroundColor: colors.background }]}>
      <ActivityIndicator color={colors.brand} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  topTitle: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  heroWrap: { height: HERO_HEIGHT, overflow: 'hidden' },
  heroInitials: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { minHeight: 400 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  stats: { flexDirection: 'row' },
  contactRow: { flexDirection: 'row', justifyContent: 'space-around' },
  langWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  langPill: { paddingVertical: 6, paddingHorizontal: 12 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
