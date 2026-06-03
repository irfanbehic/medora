import { filterProviders } from '@/features/providers/api/mockApi';
import { PROVIDERS } from '@/data/providers';

describe('filterProviders', () => {
  it('returns all providers when no filters are applied', () => {
    expect(filterProviders(PROVIDERS, {})).toHaveLength(PROVIDERS.length);
  });

  it('filters by country code', () => {
    const result = filterProviders(PROVIDERS, { countryCode: 'TR' });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.countryCode === 'TR')).toBe(true);
  });

  it('cascades country + city', () => {
    const result = filterProviders(PROVIDERS, { countryCode: 'TR', city: 'Istanbul' });
    expect(result.every((p) => p.city === 'Istanbul')).toBe(true);
  });

  it('filters by multiple categories (OR)', () => {
    const result = filterProviders(PROVIDERS, { categories: ['cardiology', 'dentistry'] });
    expect(result.every((p) => ['cardiology', 'dentistry'].includes(p.category))).toBe(true);
  });

  it('searches by name, diacritic- and case-insensitive', () => {
    const lower = filterProviders(PROVIDERS, { search: 'elif demir' });
    const noDiacritics = filterProviders(PROVIDERS, { search: 'izmir' });
    expect(lower.some((p) => p.name === 'Dr. Elif Demir')).toBe(true);
    expect(noDiacritics.length).toBeGreaterThan(0);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterProviders(PROVIDERS, { search: 'zzzzz-nope' })).toEqual([]);
  });

  it('sorts rated providers before unrated ones', () => {
    const result = filterProviders(PROVIDERS, {});
    const firstUnratedIndex = result.findIndex((p) => p.rating == null);
    const lastRatedIndex = [...result]
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p.rating != null)
      .map(({ i }) => i)
      .pop();
    if (firstUnratedIndex !== -1 && lastRatedIndex !== undefined) {
      expect(firstUnratedIndex).toBeGreaterThan(lastRatedIndex);
    }
  });
});
