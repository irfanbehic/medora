import { useFilterStore } from '@/features/filter/store';

beforeEach(() => {
  useFilterStore.setState({
    countryCode: null,
    city: null,
    categories: [],
    search: '',
    recentSearches: [],
  });
});

describe('useFilterStore', () => {
  it('applies facet filters', () => {
    useFilterStore.getState().applyFilters({
      countryCode: 'DE',
      city: 'Berlin',
      categories: ['neurology'],
    });
    const state = useFilterStore.getState();
    expect(state.countryCode).toBe('DE');
    expect(state.city).toBe('Berlin');
    expect(state.categories).toEqual(['neurology']);
  });

  it('counts active filters (country + city + each category)', () => {
    useFilterStore.getState().applyFilters({
      countryCode: 'TR',
      city: 'Izmir',
      categories: ['cardiology', 'dentistry'],
    });
    expect(useFilterStore.getState().activeCount()).toBe(4);
  });

  it('clears all facet filters but keeps search', () => {
    useFilterStore.setState({ search: 'cardio' });
    useFilterStore.getState().applyFilters({
      countryCode: 'TR',
      city: null,
      categories: ['cardiology'],
    });
    useFilterStore.getState().clearAll();
    const state = useFilterStore.getState();
    expect(state.activeCount()).toBe(0);
    expect(state.search).toBe('cardio');
  });

  it('builds the combined query object', () => {
    useFilterStore.setState({ search: 'eye', countryCode: 'AE', city: 'Dubai', categories: ['ophthalmology'] });
    expect(useFilterStore.getState().asQuery()).toEqual({
      search: 'eye',
      countryCode: 'AE',
      city: 'Dubai',
      categories: ['ophthalmology'],
    });
  });

  it('dedupes and caps recent searches', () => {
    const store = useFilterStore.getState();
    store.commitRecentSearch('cardiology');
    store.commitRecentSearch('cardiology');
    store.commitRecentSearch('dentist');
    const recents = useFilterStore.getState().recentSearches;
    expect(recents[0]).toBe('dentist');
    expect(recents.filter((r) => r === 'cardiology')).toHaveLength(1);
  });

  it('ignores too-short recent searches', () => {
    useFilterStore.getState().commitRecentSearch('a');
    expect(useFilterStore.getState().recentSearches).toHaveLength(0);
  });
});
