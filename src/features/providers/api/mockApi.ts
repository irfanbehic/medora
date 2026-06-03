import { PROVIDERS } from '@/data/providers';
import { request } from '@/lib/mockClient';
import type { Provider, ProviderFilters } from '../types';

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLocaleLowerCase();
}

/**
 * Apply search + facet filters to a provider list. Pure and synchronous so it
 * can be tested directly and reused anywhere (e.g. live result counts).
 */
export function filterProviders(
  providers: readonly Provider[],
  filters: ProviderFilters,
): Provider[] {
  const query = filters.search ? normalize(filters.search.trim()) : '';
  const categories = filters.categories ?? [];

  const result = providers.filter((p) => {
    if (filters.countryCode && p.countryCode !== filters.countryCode) return false;
    if (filters.city && p.city !== filters.city) return false;
    if (categories.length > 0 && !categories.includes(p.category)) return false;

    if (query) {
      const haystack = normalize(
        [p.name, p.city ?? '', p.category].join(' '),
      );
      if (!haystack.includes(query)) return false;
    }
    return true;
  });

  return result.sort((a, b) => {
    const ra = a.rating ?? -1;
    const rb = b.rating ?? -1;
    if (rb !== ra) return rb - ra;
    return a.name.localeCompare(b.name);
  });
}

export function getProviders(filters: ProviderFilters = {}): Promise<Provider[]> {
  return request(() => filterProviders(PROVIDERS, filters));
}

export function getProviderById(id: string): Promise<Provider> {
  return request(() => {
    const found = PROVIDERS.find((p) => p.id === id);
    if (!found) {
      throw new Error(`Provider "${id}" not found`);
    }
    return found;
  });
}
