import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { SlideInUp, SlideOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Text } from './Text';
import { useNetworkStatus } from '@/lib/useNetworkStatus';
import { useTheme } from '@/theme';

export function OfflineBanner() {
  const { isOnline } = useNetworkStatus();
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  if (isOnline) return null;

  return (
    <Animated.View
      entering={SlideInUp.duration(250)}
      exiting={SlideOutUp.duration(200)}
      style={[styles.container, { paddingTop: insets.top + spacing.sm }]}
      pointerEvents="none"
    >
      <View
        style={[
          styles.banner,
          { backgroundColor: colors.text, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
        ]}
      >
        <MaterialCommunityIcons name="wifi-off" size={16} color={colors.background} />
        <Text variant="caption" style={{ color: colors.background, marginLeft: spacing.sm }}>
          {t('offline.banner')}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
  },
});
