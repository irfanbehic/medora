import { FeedbackView } from './FeedbackView';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  title: string;
  body?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  body,
  icon = 'magnify-close',
  actionLabel,
  onAction,
}: Props) {
  return (
    <FeedbackView
      icon={icon}
      title={title}
      body={body}
      actionLabel={actionLabel}
      onAction={onAction}
    />
  );
}
