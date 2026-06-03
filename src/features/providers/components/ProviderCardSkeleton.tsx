import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/Skeleton';
import { useTheme } from '@/theme';

export function ProviderCardSkeleton() {
  const { colors, spacing, radius } = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.lg,
          padding: spacing.md,
          gap: spacing.md,
        },
      ]}
    >
      <Skeleton width={68} height={68} radius={radius.md} />
      <View style={styles.body}>
        <Skeleton width="70%" height={16} />
        <Skeleton width="45%" height={12} style={{ marginTop: 10 }} />
        <Skeleton width="55%" height={12} style={{ marginTop: 8 }} />
        <Skeleton width="40%" height={12} style={{ marginTop: 12 }} />
      </View>
    </View>
  );
}

export function ProviderListSkeleton({ count = 6 }: { count?: number }) {
  const { spacing } = useTheme();
  return (
    <View style={{ paddingHorizontal: spacing.lg, gap: spacing.md, paddingTop: spacing.sm }}>
      {Array.from({ length: count }).map((_, i) => (
        <ProviderCardSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  body: { flex: 1 },
});
