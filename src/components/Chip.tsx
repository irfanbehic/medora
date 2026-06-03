import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AnimatedPressable } from './AnimatedPressable';
import { Text } from './Text';
import { useTheme } from '@/theme';

type Props = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
    accent?: string;
};

export function Chip({ label, selected = false, onPress, icon, accent }: Props) {
  const { colors, radius, spacing } = useTheme();
  const activeColor = accent ?? colors.brand;

  return (
    <AnimatedPressable
      onPress={onPress}
      haptic="selection"
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? activeColor : colors.surface,
          borderColor: selected ? activeColor : colors.border,
          borderRadius: radius.pill,
          paddingHorizontal: spacing.lg,
          gap: spacing.xs,
        },
      ]}
    >
      <View style={styles.row}>
        {icon ? (
          <MaterialCommunityIcons
            name={icon}
            size={15}
            color={selected ? colors.onBrand : activeColor}
            style={{ marginRight: spacing.xs }}
          />
        ) : null}
        <Text
          variant="caption"
          style={{ color: selected ? colors.onBrand : colors.textMuted }}
        >
          {label}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 36,
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
});
