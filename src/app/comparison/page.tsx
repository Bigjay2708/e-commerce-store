'use client';

import { useState } from 'react';
import { useComparisonStore } from '@/store/comparison';
import ProductComparison from '@/components/products/ProductComparison';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { FaBalanceScale, FaShoppingBag } from 'react-icons/fa';

export default function ComparisonPage() {
  const { items, removeFromComparison, clearComparison } = useComparisonStore();
  const [showComparison, setShowComparison] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <FaBalanceScale className="mx-auto text-gray-400 text-6xl mb-6" />
          <h1 className="text-3xl font-bold mb-4">No Products in Comparison</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            You haven&apos;t added any products to compare yet. Browse our products and add them to comparison to see detailed comparisons.
          </p>
          <Link href="/products">
            <Button variant="primary" size="lg">
              <FaShoppingBag className="mr-2" />
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Product Comparison</h1>
        <div className="flex gap-4">
          <Button
            onClick={() => setShowComparison(true)}
            variant="primary"
          >
            <FaBalanceScale className="mr-2" />
            Compare Products ({items.length})
          </Button>
          <Button
            onClick={clearComparison}
            variant="danger"
          >
            Clear All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((product) => (
          <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48 bg-gray-50 dark:bg-gray-700">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain p-4"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
              <p className="text-2xl font-bold text-green-600 mb-4">
                ${product.price.toFixed(2)}
              </p>
              <Button
                onClick={() => removeFromComparison(product.id)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Remove from Comparison
              </Button>
            </div>
          </div>
        ))}
      </div>

      {showComparison && (
        <ProductComparison
          products={items}
          onRemoveProductAction={removeFromComparison}
          onCloseAction={() => setShowComparison(false)}
        />
      )}
    </div>
  );
}
