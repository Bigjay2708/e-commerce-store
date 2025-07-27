"use client";
import { useState } from 'react';
import { FaBookmark, FaShoppingCart, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useSavedForLaterStore } from '@/store/savedForLater';
import { useCartStore } from '@/store/cart';
import { toast } from 'react-hot-toast';
import Button from './Button';
import Image from 'next/image';
import Link from 'next/link';

export default function SavedItemsQuickAccess() {
  const { items, removeFromSaved } = useSavedForLaterStore();
  const { addToCart } = useCartStore();
  const [isExpanded, setIsExpanded] = useState(false);

  if (items.length === 0) return null;

  const handleMoveToCart = (item: any) => {
    addToCart(item);
    removeFromSaved(item.id);
    toast.success(`${item.title} moved to cart`);
  };

  const displayItems = isExpanded ? items : items.slice(0, 3);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <FaBookmark className="text-blue-600" />
          <h3 className="font-medium text-gray-900 dark:text-white">
            Saved for Later ({items.length})
          </h3>
        </div>
        <Link 
          href="/saved" 
          className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {displayItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
          >
            <Image
              src={item.image}
              alt={item.title}
              width={48}
              height={48}
              className="rounded-md object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {item.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ${item.price.toFixed(2)}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => handleMoveToCart(item)}
              className="flex items-center space-x-1 text-xs"
            >
              <FaShoppingCart className="text-xs" />
              <span>Add</span>
            </Button>
          </div>
        ))}
      </div>

      {items.length > 3 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-3 flex items-center justify-center space-x-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span>{isExpanded ? 'Show Less' : `Show ${items.length - 3} More`}</span>
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      )}
    </div>
  );
}
