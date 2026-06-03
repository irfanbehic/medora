import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '@/components/Text';
import { useTheme } from '@/theme';

type Props = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  value: string;
  label: string;
};

export function StatTile({ icon, value, label }: Props) {
  const { colors, spacing, radius } = useTheme();
  return (
    <View
      style={[
        styles.tile,
        { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md, paddingVertical: spacing.md },
      ]}
    >
      <MaterialCommunityIcons name={icon} size={20} color={colors.brand} />
      <Text variant="subheading" style={{ marginTop: 4 }}>
        {value}
      </Text>
      <Text variant="label" color="textSubtle">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
