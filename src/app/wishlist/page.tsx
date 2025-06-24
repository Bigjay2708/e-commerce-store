'use client';

import { useWishlistStore } from '@/store/wishlist';
import ProductGrid from '@/components/products/ProductGrid';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { FaHeart, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore();
  const router = useRouter();

  const handleClearWishlist = () => {
    clearWishlist();
    toast.success('Wishlist cleared');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Wishlist</h1>
        
        {items.length > 0 && (
          <Button 
            variant="danger" 
            onClick={handleClearWishlist}
          >
            <FaTrash className="mr-2" /> Clear Wishlist
          </Button>
        )}
      </div>

      {items.length > 0 ? (
        <ProductGrid products={items} />
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <FaHeart className="mx-auto text-gray-300 text-6xl mb-6" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Your wishlist is empty
          </h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            You haven&apos;t added any products to your wishlist yet.
            Browse our products to find something you like.
          </p>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => router.push('/products')}
          >
            Discover Products
          </Button>
        </div>
      )}
    </div>
  );
}
