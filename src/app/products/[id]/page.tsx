'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { fetchProductById } from '@/lib/api';
import { Product } from '@/types';
import Button from '@/components/ui/Button';
import { FaArrowLeft, FaStar, FaSpinner } from 'react-icons/fa';
import { useCartStore } from '@/store/cart';
import { toast } from 'react-hot-toast';
import ProductReviews from '@/components/products/ProductReviews';
import ProductQA from '@/components/products/ProductQA';
import SocialSharing from '@/components/products/SocialSharing';
import InfluencerShowcase from '@/components/products/InfluencerShowcase';
import SaveForLaterButton from '@/components/ui/SaveForLaterButton';
import WishlistButton from '@/components/products/WishlistButton';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCartStore();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await fetchProductById(Number(id));
        setProduct(data);
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Error loading product details');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast.success(`${product.title} added to cart`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => router.back()}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-8"
      >
        <FaArrowLeft className="mr-2" /> Back to Products
      </button>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-blue-600 text-4xl" />
        </div>      ) : product ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="relative h-[400px] w-full">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {product.title}
              </h1>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <FaStar className="text-yellow-500 w-5 h-5" />
                  <span className="ml-1 text-gray-600">
                    {product.rating.rate}
                  </span>
                </div>
                <span className="text-gray-500">
                  ({product.rating.count} reviews)
                </span>
              </div>
              
              <p className="text-gray-600 mb-6">{product.description}</p>
              
              <div className="flex items-center justify-between mb-8">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                <div className="flex items-center space-x-3">
                  <SocialSharing product={product} />
                  <span className="text-sm text-green-600 font-medium">
                    In Stock
                  </span>
                </div>
              </div>
              
              <Button 
                variant="primary" 
                size="lg" 
                fullWidth 
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              
              <div className="flex space-x-3 mt-4">
                <SaveForLaterButton 
                  product={product} 
                  variant="button" 
                  size="md" 
                  showDropdown={true}
                  className="flex-1"
                />
                <WishlistButton product={product} />
              </div>
            </div>
          </div>
          
          
          <InfluencerShowcase productId={product.id} />
          <ProductReviews productId={product.id} />
          <ProductQA productId={product.id} />
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700">
            Product not found
          </h2>
          <p className="mt-2 text-gray-500">
            The product you are looking for does not exist or has been removed.
          </p>
          <Button
            variant="primary"
            className="mt-6"
            onClick={() => router.push('/products')}
          >
            Browse Products
          </Button>
        </div>
      )}
    </div>
  );
}
