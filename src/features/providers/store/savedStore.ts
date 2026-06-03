import { create } from 'zustand';
import { getJSON, setJSON, StorageKeys } from '@/lib/storage';

type SavedState = {
  ids: string[];
  hydrated: boolean;
  isSaved: (id: string) => boolean;
  toggle: (id: string) => void;
  hydrate: () => Promise<void>;
};

export const useSavedStore = create<SavedState>((set, get) => ({
  ids: [],
  hydrated: false,

  isSaved: (id) => get().ids.includes(id),

  toggle: (id) => {
    const exists = get().ids.includes(id);
    const ids = exists ? get().ids.filter((x) => x !== id) : [id, ...get().ids];
    set({ ids });
    void setJSON(StorageKeys.savedProviderIds, ids);
  },

  hydrate: async () => {
    const ids = await getJSON<string[]>(StorageKeys.savedProviderIds, []);
    set({ ids, hydrated: true });
  },
}));
