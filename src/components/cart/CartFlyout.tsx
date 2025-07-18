import { useCartStore } from '@/store/cart';
import { useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

interface CartFlyoutProps {
  open: boolean;
  onClose: () => void;
}

const CartFlyout: React.FC<CartFlyoutProps> = ({ open, onClose }) => {
  const { cart } = useCartStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-80 max-w-full z-[100] bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      ref={ref}
      style={{ boxShadow: open ? '0 0 40px 0 rgba(0,0,0,0.2)' : undefined }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Cart</h3>
        <button onClick={onClose} aria-label="Close cart flyout" className="text-gray-500 hover:text-red-500 p-2">
          <FaTimes size={18} />
        </button>
      </div>
      <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-140px)]">
        {cart.items.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">Your cart is empty.</p>
        ) : (
          <ul className="space-y-3">
            {cart.items.map(item => (
              <li key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="relative h-12 w-12 flex-shrink-0">
                  <Image src={item.image} alt={item.title} fill className="object-contain rounded bg-gray-100" sizes="48px" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">{item.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</div>
                </div>
                <div className="text-sm font-bold text-blue-600 dark:text-blue-400">${item.price.toFixed(2)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-gray-100 mb-3">
          <span>Total:</span>
          <span>${cart.totalPrice.toFixed(2)}</span>
        </div>
        <div className="space-y-2">
          <Link href="/cart" className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition-colors text-sm">
            View Cart
          </Link>
          <Link href="/checkout" className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded transition-colors text-sm">
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartFlyout;
