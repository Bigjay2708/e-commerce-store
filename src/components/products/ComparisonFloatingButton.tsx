'use client';

import { useState } from 'react';
import { FaBalanceScale, FaTimes } from 'react-icons/fa';
import { useComparisonStore } from '@/store/comparison';
import ProductComparison from './ProductComparison';
import Button from '@/components/ui/Button';

export default function ComparisonFloatingButton() {
  const [showComparison, setShowComparison] = useState(false);
  const { items, removeFromComparison, clearComparison } = useComparisonStore();

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg">Compare Products</h3>
            <button
              onClick={clearComparison}
              className="text-gray-500 hover:text-red-500 transition-colors"
              title="Clear all"
            >
              <FaTimes size={16} />
            </button>
          </div>
          
          <div className="space-y-2 mb-4">
            {items.map((product) => (
              <div key={product.id} className="flex items-center justify-between text-sm">
                <span className="truncate flex-1 mr-2">{product.title}</span>
                <button
                  onClick={() => removeFromComparison(product.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setShowComparison(true)}
              variant="primary"
              size="sm"
              className="flex-1"
            >
              <FaBalanceScale size={14} className="mr-2" />
              Compare ({items.length})
            </Button>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      {showComparison && (
        <ProductComparison
          products={items}
          onRemoveProductAction={removeFromComparison}
          onCloseAction={() => setShowComparison(false)}
        />
      )}
    </>
  );
}
