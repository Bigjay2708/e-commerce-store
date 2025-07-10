'use client';

import { Product } from '@/types';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { FaTimes, FaHeart, FaShoppingCart, FaStar, FaCheck, FaTimes as FaX } from 'react-icons/fa';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { toast } from 'react-hot-toast';

interface ProductComparisonProps {
  products: Product[];
  onRemoveProductAction: (productId: number) => void;
  onCloseAction: () => void;
}

export default function ProductComparison({ products, onRemoveProductAction, onCloseAction }: ProductComparisonProps) {
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  const handleWishlistToggle = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success(`${product.title} removed from wishlist!`);
    } else {
      addToWishlist(product);
      toast.success(`${product.title} added to wishlist!`);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}
        size={14}
      />
    ));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getFeatureComparison = (products: Product[]) => {
    const allFeatures = new Set<string>();
    
    // Extract common features from product descriptions
    products.forEach(product => {
      const features = extractFeatures(product.description);
      features.forEach(feature => allFeatures.add(feature));
    });

    return Array.from(allFeatures);
  };

  const extractFeatures = (description: string): string[] => {
    // Simple feature extraction - you can make this more sophisticated
    const features: string[] = [];
    
    if (description.toLowerCase().includes('cotton')) features.push('Cotton Material');
    if (description.toLowerCase().includes('pocket')) features.push('Pockets');
    if (description.toLowerCase().includes('slim')) features.push('Slim Fit');
    if (description.toLowerCase().includes('casual')) features.push('Casual Style');
    if (description.toLowerCase().includes('comfortable')) features.push('Comfortable');
    if (description.toLowerCase().includes('durable')) features.push('Durable');
    if (description.toLowerCase().includes('lightweight')) features.push('Lightweight');
    if (description.toLowerCase().includes('waterproof')) features.push('Waterproof');
    if (description.toLowerCase().includes('breathable')) features.push('Breathable');
    
    return features;
  };

  const hasFeature = (product: Product, feature: string): boolean => {
    const productFeatures = extractFeatures(product.description);
    return productFeatures.includes(feature);
  };

  const features = getFeatureComparison(products);

  if (products.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-4">
          <h2 className="text-2xl font-bold mb-4">No Products to Compare</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Add products to comparison to see them here.
          </p>
          <Button onClick={onCloseAction} variant="primary">
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-7xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Product Comparison</h2>
          <button
            onClick={onCloseAction}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                {/* Product Header */}
                <div className="relative p-4 bg-gray-50 dark:bg-gray-700">
                  <button
                    onClick={() => onRemoveProductAction(product.id)}
                    className="absolute top-2 right-2 p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition-colors text-red-500"
                  >
                    <FaTimes size={16} />
                  </button>
                  
                  <div className="relative h-48 mb-4">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {renderStars(product.rating.rate)}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({product.rating.count})
                    </span>
                  </div>
                  
                  <div className="text-2xl font-bold text-green-600 mb-4">
                    {formatPrice(product.price)}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleAddToCart(product)}
                      variant="primary"
                      size="sm"
                      className="w-full"
                    >
                      <FaShoppingCart size={14} className="mr-2" />
                      Add to Cart
                    </Button>
                    
                    <Button
                      onClick={() => handleWishlistToggle(product)}
                      variant={isInWishlist(product.id) ? "danger" : "outline"}
                      size="sm"
                      className="w-full"
                    >
                      <FaHeart size={14} className="mr-2" />
                      {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    </Button>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Category</h4>
                    <p className="text-sm capitalize">{product.category}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                      {product.description}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Features</h4>
                    <div className="space-y-1">
                      {features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm">
                          {hasFeature(product, feature) ? (
                            <FaCheck className="text-green-500" size={12} />
                          ) : (
                            <FaX className="text-red-500" size={12} />
                          )}
                          <span className={hasFeature(product, feature) ? '' : 'text-gray-400'}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
