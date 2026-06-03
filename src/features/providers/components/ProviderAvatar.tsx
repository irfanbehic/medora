import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Image, type ImageStyle } from 'expo-image';
import { Text } from '@/components/Text';
import { getInitials } from '@/lib/format';
import { useTheme } from '@/theme';
import type { Provider } from '../types';

type Props = {
  provider: Provider;
  size: number;
  radius?: number;
  style?: ViewStyle;
};

export function ProviderAvatar({ provider, size, radius, style }: Props) {
  const { colors } = useTheme();
  const borderRadius = radius ?? size / 2;

  if (provider.photo) {
    return (
      <Image
        source={{ uri: provider.photo }}
        placeholder={provider.blurhash ? { blurhash: provider.blurhash } : undefined}
        contentFit="cover"
        transition={150}
        style={[{ width: size, height: size, borderRadius }, style] as StyleProp<ImageStyle>}
        accessibilityIgnoresInvertColors
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        { width: size, height: size, borderRadius, backgroundColor: colors.brandSoft },
        style,
      ]}
    >
      <Text style={{ color: colors.brand, fontSize: size * 0.36, fontWeight: '700' }}>
        {getInitials(provider.name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { alignItems: 'center', justifyContent: 'center' },
});
