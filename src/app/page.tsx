'use client';

import { useEffect, useState } from 'react';
import { fetchProducts, fetchCategories } from '@/lib/api';
import { Product } from '@/types';
import ProductGrid from '@/components/products/ProductGrid';
import SocialCommerceDashboard from '@/components/social/SocialCommerceDashboard';
import PromotionalBanner from '@/components/marketing/PromotionalBanner';
import PushNotificationDisplay from '@/components/marketing/PushNotificationDisplay';
import Button from '@/components/ui/Button';
import { FaSpinner } from 'react-icons/fa';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;

  return (
    <div className="container mx-auto px-2 sm:px-4">
      
      <PushNotificationDisplay className="mb-6" />
      
      
      <PromotionalBanner location="homepage" className="mb-6" />
      
      <section className="hero-section py-8 sm:py-12 md:py-20 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg mb-8 sm:mb-12 mx-2 sm:mx-0">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Welcome to ShopEase
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 px-2">
            Discover our wide range of quality products at unbeatable prices.
          </p>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="w-full sm:w-auto"
          >
            Shop Now
          </Button>
        </div>
      </section>

      <section className="mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center sm:text-left">Featured Products</h2>
          
          <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
            <Button
              variant={selectedCategory === '' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('')}
              className="text-xs sm:text-sm"
            >
              All
            </Button>
            
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs sm:text-sm hidden sm:inline-flex"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
            
            
            <div className="sm:hidden relative">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-background border border-border rounded-md px-3 py-1 text-sm text-foreground"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-blue-600 text-3xl sm:text-4xl" />
          </div>
        ) : (
          <>
            <SocialCommerceDashboard />
            <div className="mt-8">
              <ProductGrid products={filteredProducts} />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
