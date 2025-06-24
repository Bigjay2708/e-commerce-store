'use client';

import { useCartStore } from '@/store/cart';
import CartItem from '@/components/cart/CartItem';
import OrderSummary from '@/components/cart/OrderSummary';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { FaShoppingCart } from 'react-icons/fa';

export default function CartPage() {
  const { cart, clearCart } = useCartStore();
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

      {cart.items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {cart.items.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Items</span>
                  <span className="font-medium">{cart.totalItems}</span>
                </div>
                <OrderSummary />
              </div>
              
              <div className="space-y-3">
                <Button 
                  variant="primary" 
                  size="lg" 
                  fullWidth
                  onClick={() => router.push('/checkout')}
                >
                  Checkout
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  fullWidth
                  onClick={() => router.push('/products')}
                >
                  Continue Shopping
                </Button>
                <Button 
                  variant="danger" 
                  size="lg" 
                  fullWidth
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <FaShoppingCart className="mx-auto text-gray-300 text-6xl mb-6" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Your cart is empty
          </h2>          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Looks like you haven&apos;t added any products to your cart yet.
            Browse our products to find something you like.
          </p>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => router.push('/products')}
          >
            Start Shopping
          </Button>
        </div>
      )}
    </div>
  );
}
