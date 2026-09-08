import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX = 4;

// ─── Minimal property info stored in the tray (no extra API call needed) ─────

export interface CompareItem {
  _id:   string;
  title: string;
  cover: string | null;   // primary image URL
  price: number;
  city:  string;
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface CompareStore {
  items:  CompareItem[];

  add:    (item: CompareItem) => void;
  remove: (id: string)        => void;
  toggle: (item: CompareItem) => void;
  clear:  ()                  => void;
  has:    (id: string)        => boolean;
  isFull: ()                  => boolean;

  // Convenience: just the ids (for API calls)
  ids:    () => string[];
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],

      add: (item) =>
        set((s) =>
          s.items.find((x) => x._id === item._id) || s.items.length >= MAX
            ? s
            : { items: [...s.items, item] },
        ),

      remove: (id) =>
        set((s) => ({ items: s.items.filter((x) => x._id !== id) })),

      toggle: (item) => {
        const { items } = get();
        const exists = items.find((x) => x._id === item._id);
        if (exists) {
          set({ items: items.filter((x) => x._id !== item._id) });
        } else if (items.length < MAX) {
          set({ items: [...items, item] });
        }
      },

      clear: () => set({ items: [] }),

      has:    (id) => !!get().items.find((x) => x._id === id),
      isFull: ()   => get().items.length >= MAX,
      ids:    ()   => get().items.map((x) => x._id),
    }),
    {
      name: "gharfind-compare",   // localStorage key
    },
  ),
);

// ─── Convenient selectors ─────────────────────────────────────────────────────

export const useCompareIds   = () => useCompareStore((s) => s.items.map((x) => x._id));
export const useCompareItems = () => useCompareStore((s) => s.items);
export const useCompareCount = () => useCompareStore((s) => s.items.length);
export const useHasCompare   = (id: string) => useCompareStore((s) => !!s.items.find((x) => x._id === id));
