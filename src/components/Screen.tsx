import { type ReactNode } from 'react';
import { Image } from 'expo-image';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';

const BACKDROP = require('../../assets/images/background.png');

type Props = {
  children: ReactNode;
    edges?: readonly Edge[];
    background?: string;
    backdrop?: boolean;
  style?: ViewStyle;
};

export function Screen({
  children,
  edges = ['top', 'left', 'right'],
  background,
  backdrop = false,
  style,
}: Props) {
  const theme = useTheme();
  const showBackdrop = backdrop && theme.scheme === 'light' && !background;

  return (
    <View style={{ flex: 1, backgroundColor: background ?? theme.colors.background }}>
      {showBackdrop ? (
        <Image
          source={BACKDROP}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          pointerEvents="none"
        />
      ) : null}
      <SafeAreaView edges={edges} style={[{ flex: 1 }, style]}>
        <View style={{ flex: 1 }}>{children}</View>
      </SafeAreaView>
    </View>
  );
}
