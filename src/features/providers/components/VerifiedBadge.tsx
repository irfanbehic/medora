import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '@/components/Text';
import { useTheme } from '@/theme';

type Props = {
  label?: string;
  size?: number;
};

export function VerifiedBadge({ label, size = 16 }: Props) {
  const { colors, spacing, radius } = useTheme();

  if (!label) {
    return <MaterialCommunityIcons name="check-decagram" size={size} color={colors.verified} />;
  }

  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: colors.verified + '1A',
          borderRadius: radius.pill,
          paddingVertical: spacing.xs / 2,
          paddingHorizontal: spacing.sm,
          gap: spacing.xs,
        },
      ]}
    >
      <MaterialCommunityIcons name="check-decagram" size={size} color={colors.verified} />
      <Text variant="label" style={{ color: colors.verified }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center' },
});
