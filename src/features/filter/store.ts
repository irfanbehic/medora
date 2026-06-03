import { create } from 'zustand';
import { getJSON, setJSON, StorageKeys } from '@/lib/storage';
import type { CategoryId, ProviderFilters } from '@/features/providers/types';

const MAX_RECENT = 6;

export type AppliedFilters = {
  countryCode: string | null;
  city: string | null;
  categories: CategoryId[];
};

type FilterState = AppliedFilters & {
  search: string;
  recentSearches: string[];

  setSearch: (value: string) => void;
  commitRecentSearch: (value: string) => void;
  applyFilters: (filters: AppliedFilters) => void;
  clearAll: () => void;
    activeCount: () => number;
    asQuery: () => ProviderFilters;
  hydrate: () => Promise<void>;
};

export const useFilterStore = create<FilterState>((set, get) => ({
  countryCode: null,
  city: null,
  categories: [],
  search: '',
  recentSearches: [],

  setSearch: (search) => set({ search }),

  commitRecentSearch: (value) => {
    const trimmed = value.trim();
    if (trimmed.length < 2) return;
    const next = [trimmed, ...get().recentSearches.filter((s) => s !== trimmed)].slice(
      0,
      MAX_RECENT,
    );
    set({ recentSearches: next });
    void setJSON(StorageKeys.recentSearches, next);
  },

  applyFilters: ({ countryCode, city, categories }) =>
    set({ countryCode, city, categories }),

  clearAll: () => set({ countryCode: null, city: null, categories: [] }),

  activeCount: () => {
    const { countryCode, city, categories } = get();
    return (countryCode ? 1 : 0) + (city ? 1 : 0) + categories.length;
  },

  asQuery: () => {
    const { search, countryCode, city, categories } = get();
    return { search, countryCode, city, categories };
  },

  hydrate: async () => {
    const recentSearches = await getJSON<string[]>(StorageKeys.recentSearches, []);
    set({ recentSearches });
  },
}));
