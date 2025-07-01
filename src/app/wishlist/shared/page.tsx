"use client";
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchProductById } from '@/lib/api';
import ProductGrid from '@/components/products/ProductGrid';
import Button from '@/components/ui/Button';

function SharedWishlistContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<import('@/types').Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const itemsParam = searchParams.get('items');
    if (!itemsParam) {
      setLoading(false);
      return;
    }
    try {
      const ids = JSON.parse(atob(decodeURIComponent(itemsParam)));
      Promise.all(ids.map((id: number) => fetchProductById(id)))
        .then(setProducts)
        .finally(() => setLoading(false));
    } catch {
      setLoading(false);
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Shared Wishlist</h1>
      {loading ? (
        <div>Loading...</div>
      ) : products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            No products found in this wishlist.
          </h2>
          <Button variant="primary" onClick={() => router.push('/products')}>
            Browse Products
          </Button>
        </div>
      )}
    </div>
  );
}

export default function SharedWishlistPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SharedWishlistContent />
    </Suspense>
  );
}
