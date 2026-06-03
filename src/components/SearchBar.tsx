import { StyleSheet, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { AnimatedPressable } from './AnimatedPressable';
import { useTheme } from '@/theme';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmitEditing?: () => void;
  autoFocus?: boolean;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder,
  onSubmitEditing,
  autoFocus,
}: Props) {
  const { colors, radius, spacing } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
        },
      ]}
    >
      <MaterialCommunityIcons name="magnify" size={20} color={colors.textSubtle} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSubtle}
        onSubmitEditing={onSubmitEditing}
        autoFocus={autoFocus}
        returnKeyType="search"
        autoCorrect={false}
        clearButtonMode="never"
        accessibilityLabel={placeholder}
        style={[styles.input, { color: colors.text, marginLeft: spacing.sm }]}
      />
      {value.length > 0 ? (
        <Animated.View entering={FadeIn.duration(120)} exiting={FadeOut.duration(120)}>
          <AnimatedPressable
            haptic="selection"
            onPress={() => onChangeText('')}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            hitSlop={8}
          >
            <MaterialCommunityIcons
              name="close-circle"
              size={18}
              color={colors.textSubtle}
            />
          </AnimatedPressable>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
});
