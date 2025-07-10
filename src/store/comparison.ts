import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface ComparisonStore {
  items: Product[];
  addToComparison: (product: Product) => void;
  removeFromComparison: (productId: number) => void;
  clearComparison: () => void;
  isInComparison: (productId: number) => boolean;
}

export const useComparisonStore = create<ComparisonStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToComparison: (product) => {
        const { items } = get();
        
        // Maximum 4 products for comparison
        if (items.length >= 4) {
          return;
        }
        
        // Don't add if already in comparison
        if (items.find(item => item.id === product.id)) {
          return;
        }
        
        set({ items: [...items, product] });
      },
      
      removeFromComparison: (productId) => {
        set({ items: get().items.filter(item => item.id !== productId) });
      },
      
      clearComparison: () => {
        set({ items: [] });
      },
      
      isInComparison: (productId) => {
        return get().items.some(item => item.id === productId);
      },
    }),
    {
      name: 'comparison-store',
    }
  )
);
