import {
  getCategoryMeta,
  getCitiesForCountry,
  getCountry,
} from '@/data/taxonomy';

describe('taxonomy', () => {
  it('returns cities scoped to a country (cascade)', () => {
    expect(getCitiesForCountry('TR')).toContain('Istanbul');
    expect(getCitiesForCountry('TR')).not.toContain('Berlin');
  });

  it('returns an empty city list for unknown/empty country', () => {
    expect(getCitiesForCountry(null)).toEqual([]);
    expect(getCitiesForCountry('XX')).toEqual([]);
  });

  it('resolves a country by code', () => {
    expect(getCountry('DE')?.name).toBe('Germany');
    expect(getCountry(undefined)).toBeUndefined();
  });

  it('falls back to a safe category meta for unknown ids', () => {
    expect(getCategoryMeta('not-a-category' as never)).toBeDefined();
    expect(getCategoryMeta('cardiology').icon).toBe('heart-pulse');
  });
});
