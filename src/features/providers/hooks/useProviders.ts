import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { PROVIDERS } from '@/data/providers';
import { getProviderById, getProviders } from '../api/mockApi';
import type { ProviderFilters } from '../types';

export const providerKeys = {
  all: ['providers'] as const,
  list: (filters: ProviderFilters) => ['providers', 'list', filters] as const,
  detail: (id: string) => ['providers', 'detail', id] as const,
};

export function useProviders(filters: ProviderFilters) {
  return useQuery({
    queryKey: providerKeys.list(filters),
    queryFn: () => getProviders(filters),

    placeholderData: keepPreviousData,

    staleTime: Infinity,
  });
}

export function useProvider(id: string) {
  return useQuery({
    queryKey: providerKeys.detail(id),
    queryFn: () => getProviderById(id),
    enabled: Boolean(id),

    initialData: () => PROVIDERS.find((p) => p.id === id),
  });
}
