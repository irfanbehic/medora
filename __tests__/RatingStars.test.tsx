import { render } from '@testing-library/react-native';
import { RatingStars } from '@/features/providers/components/RatingStars';
import { ThemeProvider } from '@/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('RatingStars', () => {
  it('shows the numeric rating and review count when rated', () => {
    const { getByText } = renderWithTheme(<RatingStars rating={4.7} reviewCount={120} />);
    expect(getByText(/4\.7/)).toBeTruthy();
    expect(getByText(/\(120\)/)).toBeTruthy();
  });

  it('falls back to a dash when unrated (null-safe)', () => {
    const { getByText } = renderWithTheme(<RatingStars rating={null} />);
    expect(getByText('—')).toBeTruthy();
  });
});
