'use client';

import { useEffect, useState } from 'react';
import { fetchProducts, fetchCategories } from '@/lib/api';
import { Product } from '@/types';
import ProductGrid from '@/components/products/ProductGrid';
import { FaSpinner } from 'react-icons/fa';

export default function ProductsPage() {
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
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center sm:text-left">All Products</h1>
      
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 mb-6 sm:mb-8">
        {/* Mobile Category Dropdown */}
        <div className="lg:hidden">
          <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by Category
          </label>
          <select 
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Category Sidebar */}
        <div className="hidden lg:block w-64 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Categories</h2>
          <div className="flex flex-col space-y-2">
            <button
              className={`text-left px-4 py-3 rounded-lg transition-colors text-sm ${
                selectedCategory === '' 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
              onClick={() => setSelectedCategory('')}
            >
              All Products
            </button>
            
            {categories.map(category => (
              <button
                key={category}
                className={`text-left px-4 py-3 rounded-lg transition-colors text-sm ${
                  selectedCategory === category 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin text-blue-600 text-3xl sm:text-4xl" />
            </div>
          ) : (
            <>
              <div className="mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white text-center sm:text-left">
                  {selectedCategory 
                    ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} (${filteredProducts.length})`
                    : `All Products (${products.length})`}
                </h2>
              </div>
              <ProductGrid products={filteredProducts} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
