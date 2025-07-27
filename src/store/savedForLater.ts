import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

export interface SavedItem extends Product {
  savedAt: string;
  reason?: 'price_check' | 'out_of_stock' | 'consider_later' | 'gift_idea' | 'custom';
  customReason?: string;
  reminderDate?: string;
  notes?: string;
}

interface SavedForLaterStore {
  items: SavedItem[];
  addToSaved: (product: Product, reason?: SavedItem['reason'], customReason?: string, notes?: string) => void;
  removeFromSaved: (productId: number) => void;
  updateSavedItem: (productId: number, updates: Partial<Pick<SavedItem, 'reason' | 'customReason' | 'reminderDate' | 'notes'>>) => void;
  isInSaved: (productId: number) => boolean;
  getSavedItem: (productId: number) => SavedItem | undefined;
  clearSaved: () => void;
  clearExpiredItems: () => void;
  getSavedByReason: (reason: SavedItem['reason']) => SavedItem[];
  moveToCart: (productId: number) => void;
  moveToWishlist: (productId: number) => void;
}

export const useSavedForLaterStore = create<SavedForLaterStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToSaved: (product: Product, reason = 'consider_later', customReason, notes) => 
        set((state) => {
          // Remove if already exists and re-add with updated timestamp
          const existingIndex = state.items.findIndex(item => item.id === product.id);
          const newItem: SavedItem = {
            ...product,
            savedAt: new Date().toISOString(),
            reason,
            customReason,
            notes,
          };
          
          if (existingIndex !== -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex] = newItem;
            return { items: updatedItems };
          }
          
          return { items: [...state.items, newItem] };
        }),
      
      removeFromSaved: (productId: number) => 
        set((state) => ({
          items: state.items.filter(item => item.id !== productId)
        })),
      
      updateSavedItem: (productId: number, updates) =>
        set((state) => ({
          items: state.items.map(item =>
            item.id === productId ? { ...item, ...updates } : item
          )
        })),
      
      isInSaved: (productId: number) => 
        get().items.some(item => item.id === productId),
      
      getSavedItem: (productId: number) =>
        get().items.find(item => item.id === productId),
      
      clearSaved: () => set({ items: [] }),
      
      clearExpiredItems: () =>
        set((state) => {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          return {
            items: state.items.filter(item => 
              new Date(item.savedAt) > thirtyDaysAgo
            )
          };
        }),
      
      getSavedByReason: (reason: SavedItem['reason']) =>
        get().items.filter(item => item.reason === reason),
      
      moveToCart: (productId: number) => {
        const item = get().getSavedItem(productId);
        if (item) {
          // Import cart store dynamically to avoid circular dependency
          import('./cart').then(({ useCartStore }) => {
            useCartStore.getState().addToCart(item);
          });
          get().removeFromSaved(productId);
        }
      },
      
      moveToWishlist: (productId: number) => {
        const item = get().getSavedItem(productId);
        if (item) {
          // Import wishlist store dynamically to avoid circular dependency
          import('./wishlist').then(({ useWishlistStore }) => {
            useWishlistStore.getState().addToWishlist(item);
          });
          get().removeFromSaved(productId);
        }
      },
    }),
    {
      name: 'saved-for-later-storage',
    }
  )
);
