import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AnimatedPressable } from './AnimatedPressable';
import { Text } from './Text';
import { useTheme } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost';

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  fullWidth = true,
}: Props) {
  const theme = useTheme();
  const { colors, radius, spacing } = theme;

  const palette = {
    primary: { bg: colors.brand, fg: colors.onBrand, border: 'transparent' },
    secondary: { bg: colors.surfaceAlt, fg: colors.text, border: colors.border },
    ghost: { bg: 'transparent', fg: colors.brand, border: 'transparent' },
  }[variant];

  const isDisabled = disabled || loading;

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={isDisabled}
      haptic="impact"
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={[
        styles.base,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          borderWidth: variant === 'secondary' ? StyleSheet.hairlineWidth : 0,
          borderRadius: radius.md,
          paddingHorizontal: spacing.lg,
          opacity: isDisabled ? 0.55 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={palette.fg} />
        ) : (
          <>
            {icon ? (
              <MaterialCommunityIcons
                name={icon}
                size={18}
                color={palette.fg}
                style={{ marginRight: spacing.sm }}
              />
            ) : null}
            <Text variant="bodyStrong" style={{ color: palette.fg }}>
              {title}
            </Text>
          </>
        )}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
