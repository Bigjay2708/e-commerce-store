'use client';

import { FaBalanceScale, FaCheck } from 'react-icons/fa';
import { useComparisonStore } from '@/store/comparison';
import { Product } from '@/types';
import { toast } from 'react-hot-toast';

interface ComparisonButtonProps {
  product: Product;
  className?: string;
}

export default function ComparisonButton({ product, className = '' }: ComparisonButtonProps) {
  const { addToComparison, removeFromComparison, isInComparison, items } = useComparisonStore();

  const handleToggleComparison = () => {
    if (isInComparison(product.id)) {
      removeFromComparison(product.id);
      toast.success(`${product.title} removed from comparison!`);
    } else {
      if (items.length >= 4) {
        toast.error('Maximum 4 products can be compared at once!');
        return;
      }
      addToComparison(product);
      toast.success(`${product.title} added to comparison!`);
    }
  };

  const inComparison = isInComparison(product.id);

  return (
    <button
      onClick={handleToggleComparison}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
        inComparison
          ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
      } ${className}`}
      title={inComparison ? 'Remove from comparison' : 'Add to comparison'}
    >
      {inComparison ? (
        <FaCheck size={14} />
      ) : (
        <FaBalanceScale size={14} />
      )}
      <span className="text-sm font-medium">
        {inComparison ? 'In Comparison' : 'Compare'}
      </span>
    </button>
  );
}
