import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface WishlistStore {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToWishlist: (product: Product) => 
        set((state) => {
          if (state.items.some(item => item.id === product.id)) {
            return state;
          }
          return { items: [...state.items, product] };
        }),
      
      removeFromWishlist: (productId: number) => 
        set((state) => ({
          items: state.items.filter(item => item.id !== productId)
        })),
      
      isInWishlist: (productId: number) => 
        get().items.some(item => item.id === productId),
      
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
