import { type ComponentProps } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { haptics } from '@/lib/haptics';

const AnimatedBase = Animated.createAnimatedComponent(Pressable);

type Props = ComponentProps<typeof Pressable> & {
    pressScale?: number;
    haptic?: 'none' | 'light' | 'selection' | 'impact';
};

export function AnimatedPressable({
  pressScale = 0.97,
  haptic = 'light',
  onPressIn,
  onPressOut,
  style,
  children,
  ...rest
}: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedBase
      onPressIn={(e) => {
        scale.value = withTiming(pressScale, { duration: 90 });
        if (haptic === 'light') haptics.light();
        else if (haptic === 'selection') haptics.selection();
        else if (haptic === 'impact') haptics.impact();
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withTiming(1, { duration: 140 });
        onPressOut?.(e);
      }}
      style={[animatedStyle, style as object]}
      {...rest}
    >
      {children}
    </AnimatedBase>
  );
}
