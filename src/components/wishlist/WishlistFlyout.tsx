"use client";
import { useWishlistStore } from '@/store/wishlist';
import { useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

interface WishlistFlyoutProps {
  open: boolean;
  onClose: () => void;
}

const WishlistFlyout: React.FC<WishlistFlyoutProps> = ({ open, onClose }) => {
  const { items, removeFromWishlist } = useWishlistStore();
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
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Wishlist</h3>
        <button onClick={onClose} aria-label="Close wishlist flyout" className="text-gray-500 hover:text-red-500 p-2">
          <FaTimes size={18} />
        </button>
      </div>
      <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-140px)]">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Your wishlist is empty.</p>
            <Link href="/products" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
              Start shopping
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map(item => (
              <li key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="relative h-12 w-12 flex-shrink-0">
                  <Image src={item.image} alt={item.title} fill className="object-contain rounded bg-gray-100" sizes="48px" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">{item.title}</div>
                  <div className="text-sm font-bold text-blue-600 mt-1">${item.price.toFixed(2)}</div>
                </div>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 rounded flex-shrink-0"
                  aria-label="Remove from wishlist"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Link href="/wishlist" className="block w-full text-center bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded transition-colors text-sm">
          View Wishlist
        </Link>
      </div>
    </div>
  );
};

export default WishlistFlyout;
