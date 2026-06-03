import { FeedbackView } from './FeedbackView';

type Props = {
  title: string;
  body?: string;
  retryLabel?: string;
  onRetry?: () => void;
};

export function ErrorState({ title, body, retryLabel, onRetry }: Props) {
  return (
    <FeedbackView
      icon="wifi-off"
      tone="danger"
      title={title}
      body={body}
      actionLabel={retryLabel}
      onAction={onRetry}
    />
  );
}
