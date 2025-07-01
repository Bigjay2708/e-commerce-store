'use client';


import { useWishlistStore } from '@/store/wishlist';
import ProductGrid from '@/components/products/ProductGrid';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { FaHeart, FaTrash, FaShareAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { generateWishlistShareId } from '@/lib/wishlistShare';

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore();
  const router = useRouter();
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleClearWishlist = () => {
    clearWishlist();
    toast.success('Wishlist cleared');
  };

  const handleShareWishlist = () => {
    // For demo: encode wishlist in URL (in production, use backend)
    const id = generateWishlistShareId();
    const encoded = encodeURIComponent(btoa(JSON.stringify(items.map(i => i.id))));
    const url = `${window.location.origin}/wishlist/shared?id=${id}&items=${encoded}`;
    setShareUrl(url);
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Wishlist share link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Wishlist</h1>
        <div className="flex gap-2">
          {items.length > 0 && (
            <>
              <Button 
                variant="secondary"
                onClick={handleShareWishlist}
              >
                <FaShareAlt className="mr-2" /> Share Wishlist
              </Button>
              <Button 
                variant="danger" 
                onClick={handleClearWishlist}
              >
                <FaTrash className="mr-2" /> Clear Wishlist
              </Button>
            </>
          )}
        </div>
      </div>

      {shareUrl && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg flex items-center justify-between">
          <span className="text-blue-700 dark:text-blue-200 break-all">{shareUrl}</span>
          <span className="ml-4 text-green-600 font-semibold">{copied ? 'Copied!' : ''}</span>
        </div>
      )}

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
