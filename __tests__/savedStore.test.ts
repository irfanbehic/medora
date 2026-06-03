import { useSavedStore } from '@/features/providers/store/savedStore';

beforeEach(() => {
  useSavedStore.setState({ ids: [], hydrated: false });
});

describe('useSavedStore', () => {
  it('toggles a provider on and off', () => {
    const { toggle } = useSavedStore.getState();
    toggle('p1');
    expect(useSavedStore.getState().isSaved('p1')).toBe(true);
    toggle('p1');
    expect(useSavedStore.getState().isSaved('p1')).toBe(false);
  });

  it('keeps most-recently-saved first', () => {
    const { toggle } = useSavedStore.getState();
    toggle('p1');
    toggle('p2');
    expect(useSavedStore.getState().ids).toEqual(['p2', 'p1']);
  });

  it('reports membership correctly', () => {
    useSavedStore.setState({ ids: ['p3'] });
    expect(useSavedStore.getState().isSaved('p3')).toBe(true);
    expect(useSavedStore.getState().isSaved('p9')).toBe(false);
  });
});
