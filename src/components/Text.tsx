import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { useTheme } from '@/theme';
import type { ColorScheme } from '@/theme/colors';
import type { typography } from '@/theme/tokens';

type Variant = keyof typeof typography;
type ColorRole = keyof Pick<
  ColorScheme,
  'text' | 'textMuted' | 'textSubtle' | 'brand' | 'onBrand' | 'danger' | 'success' | 'accent'
>;

export type TextProps = RNTextProps & {
  variant?: Variant;
  color?: ColorRole;
  center?: boolean;
};

export function Text({
  variant = 'body',
  color = 'text',
  center,
  style,
  ...rest
}: TextProps) {
  const theme = useTheme();
  const t = theme.typography[variant];
  return (
    <RNText
      style={[
        {
          fontSize: t.fontSize,
          lineHeight: t.lineHeight,
          fontWeight: t.fontWeight,
          color: theme.colors[color],
          textAlign: center ? 'center' : undefined,
        },
        style,
      ]}
      {...rest}
    />
  );
}
