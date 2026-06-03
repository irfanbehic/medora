import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/Text';
import { formatDate, getInitials } from '@/lib/format';
import { useTheme } from '@/theme';
import { RatingStars } from './RatingStars';
import type { Review } from '../types';

export function ReviewCard({ review }: { review: Review }) {
  const { colors, spacing, radius } = useTheme();
  const { i18n } = useTranslation();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.brandSoft }]}>
          <Text variant="label" style={{ color: colors.brand }}>
            {getInitials(review.author)}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="bodyStrong">{review.author}</Text>
          <Text variant="label" color="textSubtle">
            {formatDate(review.date, i18n.language)}
          </Text>
        </View>
        <RatingStars rating={review.rating} showValue={false} size={12} />
      </View>
      <Text variant="body" color="textMuted" style={{ marginTop: spacing.sm }}>
        {review.comment}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: StyleSheet.hairlineWidth },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
