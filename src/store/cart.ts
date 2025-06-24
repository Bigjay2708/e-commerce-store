import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Cart, CartItem } from '@/types';

interface CartStore {
  cart: Cart;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const initialCart: Cart = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: initialCart,
      
      addToCart: (product: Product) =>
        set((state) => {
          const existingItem = state.cart.items.find(item => item.id === product.id);
          
          if (existingItem) {
            // Update quantity
            const updatedItems = state.cart.items.map(item => 
              item.id === product.id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            );
            
            return {
              cart: {
                items: updatedItems,
                totalItems: state.cart.totalItems + 1,
                totalPrice: state.cart.totalPrice + product.price,
              }
            };
          } else {
            // Add new item
            const newItem: CartItem = { ...product, quantity: 1 };
            
            return {
              cart: {
                items: [...state.cart.items, newItem],
                totalItems: state.cart.totalItems + 1,
                totalPrice: state.cart.totalPrice + product.price,
              }
            };
          }
        }),
      
      removeFromCart: (productId: number) =>
        set((state) => {
          const itemToRemove = state.cart.items.find(item => item.id === productId);
          
          if (!itemToRemove) return state;
          
          const updatedItems = state.cart.items.filter(item => item.id !== productId);
          
          return {
            cart: {
              items: updatedItems,
              totalItems: state.cart.totalItems - itemToRemove.quantity,
              totalPrice: state.cart.totalPrice - (itemToRemove.price * itemToRemove.quantity),
            }
          };
        }),
      
      updateQuantity: (productId: number, quantity: number) =>
        set((state) => {
          const existingItem = state.cart.items.find(item => item.id === productId);
          
          if (!existingItem) return state;
          
          const quantityDifference = quantity - existingItem.quantity;
          
          const updatedItems = state.cart.items.map(item => 
            item.id === productId 
              ? { ...item, quantity } 
              : item
          );
          
          return {
            cart: {
              items: updatedItems,
              totalItems: state.cart.totalItems + quantityDifference,
              totalPrice: state.cart.totalPrice + (existingItem.price * quantityDifference),
            }
          };
        }),
      
      clearCart: () =>
        set(() => ({
          cart: initialCart,
        })),
    }),
    {
      name: 'cart-storage',
    }
  )
);
