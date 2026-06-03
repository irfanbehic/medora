import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { Text } from '@/components/Text';
import { formatRating } from '@/lib/format';
import { useTheme } from '@/theme';
import { RatingStars } from './RatingStars';
import type { RatingBreakdown } from '../types';

type Props = {
  breakdown: RatingBreakdown;
  average: number | null | undefined;
  reviewCount: number;
};

export function RatingDistribution({ breakdown, average, reviewCount }: Props) {
  const total = breakdown.reduce((a, c) => a + c, 0);
  const max = Math.max(...breakdown, 1);

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text variant="display">{formatRating(average)}</Text>
        <RatingStars rating={average} showValue={false} size={14} />
        <Text variant="caption" color="textSubtle" style={{ marginTop: 4 }}>
          {reviewCount}
        </Text>
      </View>

      <View style={styles.bars}>
        {[5, 4, 3, 2, 1].map((star, i) => (
          <Bar
            key={star}
            star={star}
            value={breakdown[star - 1]}
            ratio={total === 0 ? 0 : breakdown[star - 1] / max}
            delay={i * 70}
          />
        ))}
      </View>
    </View>
  );
}

function Bar({
  star,
  value,
  ratio,
  delay,
}: {
  star: number;
  value: number;
  ratio: number;
  delay: number;
}) {
  const { colors, spacing } = useTheme();
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withDelay(delay, withTiming(ratio, { duration: 500 }));
  }, [ratio, delay, width]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${Math.max(width.value * 100, value > 0 ? 4 : 0)}%`,
  }));

  return (
    <View style={[styles.barRow, { gap: spacing.sm }]}>
      <View style={styles.barLabel}>
        <Text variant="caption" color="textMuted">
          {star}
        </Text>
        <MaterialCommunityIcons name="star" size={11} color={colors.accent} />
      </View>
      <View style={[styles.track, { backgroundColor: colors.surfaceAlt }]}>
        <Animated.View style={[styles.fill, { backgroundColor: colors.accent }, fillStyle]} />
      </View>
      <Text variant="label" color="textSubtle" style={styles.barCount}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  summary: { alignItems: 'center', width: 92 },
  bars: { flex: 1, gap: 6 },
  barRow: { flexDirection: 'row', alignItems: 'center' },
  barLabel: { flexDirection: 'row', alignItems: 'center', width: 26, gap: 2 },
  track: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
  barCount: { width: 28, textAlign: 'right' },
});
