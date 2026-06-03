import { ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Chip } from '@/components/Chip';
import { CATEGORIES } from '@/data/taxonomy';
import { useTheme } from '@/theme';
import type { CategoryId } from '../types';

type Props = {
  selected: CategoryId | null;
  onSelect: (category: CategoryId | null) => void;
};

export function CategoryFilterRow({ selected, onSelect }: Props) {
  const { t } = useTranslation();
  const { spacing } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.content, { paddingHorizontal: spacing.lg, gap: spacing.sm }]}
    >
      <Chip
        label={t('list.allCategories')}
        selected={selected == null}
        onPress={() => onSelect(null)}
      />
      {CATEGORIES.map((cat) => (
        <Chip
          key={cat.id}
          label={t(`categories.${cat.id}`)}
          icon={cat.icon as never}
          accent={cat.color}
          selected={selected === cat.id}
          onPress={() => onSelect(selected === cat.id ? null : cat.id)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingVertical: 4 },
});
