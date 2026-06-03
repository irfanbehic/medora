import Constants from 'expo-constants';
import { ScrollView, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Screen, Text, AnimatedPressable } from '@/components';
import { haptics } from '@/lib/haptics';
import { useSettings, type Locale, type ThemeMode } from '@/store/settings';
import { useTheme } from '@/theme';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();

  const themeMode = useSettings((s) => s.themeMode);
  const setThemeMode = useSettings((s) => s.setThemeMode);
  const locale = useSettings((s) => s.locale);
  const setLocale = useSettings((s) => s.setLocale);

  const themeOptions: { value: ThemeMode; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
    { value: 'system', label: t('settings.themeSystem'), icon: 'cellphone' },
    { value: 'light', label: t('settings.themeLight'), icon: 'white-balance-sunny' },
    { value: 'dark', label: t('settings.themeDark'), icon: 'weather-night' },
  ];

  const localeOptions: { value: Locale; label: string }[] = [
    { value: 'en', label: t('settings.english') },
    { value: 'tr', label: t('settings.turkish') },
  ];

  return (
    <Screen backdrop>
      <View style={[styles.header, { paddingHorizontal: spacing.lg }]}>
        <Text variant="display">{t('settings.title')}</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <Group title={t('settings.appearance')}>
          {themeOptions.map((opt) => (
            <OptionRow
              key={opt.value}
              icon={opt.icon}
              label={opt.label}
              selected={themeMode === opt.value}
              onPress={() => {
                haptics.selection();
                setThemeMode(opt.value);
              }}
            />
          ))}
        </Group>

        <Group title={t('settings.language')}>
          {localeOptions.map((opt) => (
            <OptionRow
              key={opt.value}
              icon="translate"
              label={opt.label}
              selected={locale === opt.value}
              onPress={() => {
                haptics.selection();
                setLocale(opt.value);
              }}
            />
          ))}
        </Group>

        <Group title={t('settings.about')}>
          <View style={[styles.aboutCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text variant="body" color="textMuted" style={{ lineHeight: 22 }}>
              {t('settings.aboutBody')}
            </Text>
            <View style={[styles.versionRow, { borderTopColor: colors.border }]}>
              <Text variant="caption" color="textSubtle">
                {t('settings.version')}
              </Text>
              <Text variant="caption" color="textMuted">
                {Constants.expoConfig?.version ?? '1.0.0'}
              </Text>
            </View>
          </View>
        </Group>
      </ScrollView>
    </Screen>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors, spacing, radius } = useTheme();
  return (
    <View style={{ gap: spacing.sm }}>
      <Text variant="label" color="textSubtle" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {title}
      </Text>
      <View style={[styles.group, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg }]}>
        {children}
      </View>
    </View>
  );
}

function OptionRow({
  icon,
  label,
  selected,
  onPress,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { colors, spacing } = useTheme();
  return (
    <AnimatedPressable
      haptic="none"
      onPress={onPress}
      style={[styles.row, { paddingHorizontal: spacing.lg, borderBottomColor: colors.border }]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <MaterialCommunityIcons name={icon} size={20} color={selected ? colors.brand : colors.textMuted} />
      <Text variant="body" style={{ flex: 1, marginLeft: spacing.md, color: selected ? colors.text : colors.textMuted }}>
        {label}
      </Text>
      {selected ? <MaterialCommunityIcons name="check" size={20} color={colors.brand} /> : null}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 8, paddingBottom: 12 },
  group: { borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', height: 54, borderBottomWidth: StyleSheet.hairlineWidth },
  aboutCard: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 16, padding: 16, gap: 12 },
  versionRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth },
});
