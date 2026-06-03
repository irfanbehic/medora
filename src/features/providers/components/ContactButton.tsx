import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { Text } from '@/components/Text';
import { useTheme } from '@/theme';

type Props = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
};

export function ContactButton({ icon, label, onPress }: Props) {
  const { colors, spacing, radius } = useTheme();
  return (
    <AnimatedPressable
      haptic="impact"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.wrap}
    >
      <View
        style={[
          styles.circle,
          { backgroundColor: colors.brandSoft, borderRadius: radius.pill },
        ]}
      >
        <MaterialCommunityIcons name={icon} size={22} color={colors.brand} />
      </View>
      <Text variant="label" color="textMuted" style={{ marginTop: spacing.xs }}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', flex: 1 },
  circle: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },
});
