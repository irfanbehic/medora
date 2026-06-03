import {
  formatCount,
  formatLocation,
  formatRating,
  getInitials,
} from '@/lib/format';

describe('formatRating', () => {
  it('formats a number to one decimal', () => {
    expect(formatRating(4.7)).toBe('4.7');
    expect(formatRating(5)).toBe('5.0');
  });

  it('shows a dash for missing ratings', () => {
    expect(formatRating(null)).toBe('—');
    expect(formatRating(undefined)).toBe('—');
    expect(formatRating(NaN)).toBe('—');
  });
});

describe('formatCount', () => {
  it('keeps small numbers as-is', () => {
    expect(formatCount(980)).toBe('980');
  });

  it('compacts thousands and millions', () => {
    expect(formatCount(8200)).toBe('8.2k');
    expect(formatCount(145000)).toBe('145k');
    expect(formatCount(1_500_000)).toBe('1.5M');
  });

  it('handles nullish input', () => {
    expect(formatCount(null)).toBe('0');
    expect(formatCount(undefined)).toBe('0');
  });
});

describe('getInitials', () => {
  it('strips honorifics and uses first + last initials', () => {
    expect(getInitials('Dr. Elif Demir')).toBe('ED');
    expect(getInitials('Acıbadem Maslak Hospital')).toBe('AH');
  });

  it('falls back gracefully', () => {
    expect(getInitials('')).toBe('?');
    expect(getInitials(null)).toBe('?');
  });
});

describe('formatLocation', () => {
  it('joins present parts only', () => {
    expect(formatLocation('Istanbul', 'Türkiye')).toBe('Istanbul, Türkiye');
    expect(formatLocation(null, 'Türkiye')).toBe('Türkiye');
    expect(formatLocation('Istanbul', null)).toBe('Istanbul');
    expect(formatLocation(null, null)).toBe('');
  });
});
