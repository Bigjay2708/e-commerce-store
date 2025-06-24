import { useCartStore } from '@/store/cart';
import { OrderSummary } from '@/types';

export const useOrderSummary = (): OrderSummary => {
  const { cart } = useCartStore();
  
  const subtotal = cart.totalPrice;
  const shipping = 0; // Free shipping in our demo
  const tax = subtotal * 0.1; // 10% tax rate
  const total = subtotal + shipping + tax;
  
  return {
    subtotal,
    shipping,
    tax,
    total
  };
};
