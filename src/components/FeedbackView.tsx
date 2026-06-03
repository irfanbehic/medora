import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Button } from './Button';
import { Text } from './Text';
import { useTheme } from '@/theme';

export type FeedbackViewProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  body?: string;
  tone?: 'neutral' | 'danger';
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
};

export function FeedbackView({
  icon,
  title,
  body,
  tone = 'neutral',
  actionLabel,
  onAction,
  children,
}: FeedbackViewProps) {
  const { colors, spacing, radius } = useTheme();
  const accent = tone === 'danger' ? colors.danger : colors.brand;

  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      style={[styles.container, { padding: spacing.xl }]}
    >
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: colors.brandSoft, borderRadius: radius.pill, marginBottom: spacing.lg },
        ]}
      >
        <MaterialCommunityIcons name={icon} size={34} color={accent} />
      </View>
      <Text variant="heading" center style={{ marginBottom: spacing.sm }}>
        {title}
      </Text>
      {body ? (
        <Text variant="body" color="textMuted" center style={{ maxWidth: 300 }}>
          {body}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <View style={{ marginTop: spacing.xl, minWidth: 180 }}>
          <Button title={actionLabel} onPress={onAction} variant="primary" />
        </View>
      ) : null}
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 84,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
