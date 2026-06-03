import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '@/components/Text';
import { formatRating } from '@/lib/format';
import { useTheme } from '@/theme';

type Props = {
  rating: number | null | undefined;
  reviewCount?: number;
  size?: number;
    showValue?: boolean;
};

export function RatingStars({ rating, reviewCount, size = 14, showValue = true }: Props) {
  const { colors, spacing } = useTheme();

  const isRated = rating != null && rating > 0;

  return (
    <View style={styles.row}>
      <View style={styles.stars}>
        {[0, 1, 2, 3, 4].map((i) => {
          const value = rating ?? 0;
          const name =
            value >= i + 1 ? 'star' : value >= i + 0.5 ? 'star-half-full' : 'star-outline';
          return (
            <MaterialCommunityIcons
              key={i}
              name={name}
              size={size}
              color={isRated ? colors.accent : colors.textSubtle}
            />
          );
        })}
      </View>
      {showValue ? (
        <Text variant="caption" style={{ color: colors.text, marginLeft: spacing.xs }}>
          {formatRating(rating)}
          {isRated && reviewCount ? (
            <Text variant="caption" color="textSubtle">{`  (${reviewCount})`}</Text>
          ) : null}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  stars: { flexDirection: 'row' },
});
