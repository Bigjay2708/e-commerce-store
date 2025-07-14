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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 flex flex-col items-center py-6 sm:py-12 px-2 sm:px-4 md:px-0 transition-colors duration-500">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-lg mb-6 sm:mb-10 tracking-tight animate-fade-in text-center">
        Your Cart
      </h1>

      <div className="w-full max-w-6xl">
        {cart.items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10 animate-fade-in">
            <div className="lg:col-span-2">
              <div className="bg-white/90 rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-md border border-white/30 transition-all duration-300">
                <div className="space-y-4">
                  {cart.items.map(item => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white/60 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 lg:sticky lg:top-24 backdrop-blur-lg border border-white/30">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight text-center lg:text-left">
                  Order Summary
                </h2>
                <div className="mb-6 sm:mb-8">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-medium text-sm sm:text-base">Items</span>
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">
                      {cart.totalItems}
                    </span>
                  </div>
                  <OrderSummary />
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    className="transition-transform duration-200 hover:scale-105 shadow-md text-sm sm:text-base"
                    onClick={() => router.push('/checkout')}
                  >
                    Checkout
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                    className="transition-transform duration-200 hover:scale-105"
                    onClick={() => router.push('/products')}
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    variant="danger"
                    size="lg"
                    fullWidth
                    className="transition-transform duration-200 hover:scale-105"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-white/80 rounded-2xl shadow-2xl p-12 max-w-xl mx-auto animate-fade-in">
            <FaShoppingCart className="mx-auto text-blue-500 text-7xl mb-6 drop-shadow-lg animate-bounce" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 tracking-tight">
              Your cart is empty
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven&apos;t added any products to your cart yet.
              <br />
              <span className="font-semibold text-blue-700">
                Browse our products to find something you like!
              </span>
            </p>
            <Button
              variant="primary"
              size="lg"
              className="transition-transform duration-200 hover:scale-105 shadow-md"
              onClick={() => router.push('/products')}
            >
              Start Shopping
            </Button>
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        .animate-bounce {
          animation: bounce 1.2s infinite alternate;
        }
        @keyframes bounce {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
