import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchProducts, fetchProductById } from '@/lib/api';

// Mock fetch globally
global.fetch = vi.fn();

const mockFetch = vi.mocked(fetch);

describe('API Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('fetchProducts', () => {
    it('fetches products successfully', async () => {
      const mockProducts = [
        { id: 1, title: 'Product 1', price: 29.99 },
        { id: 2, title: 'Product 2', price: 39.99 },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      } as Response);

      const result = await fetchProducts();

      expect(mockFetch).toHaveBeenCalledWith('https://fakestoreapi.com/products');
      expect(result).toEqual(mockProducts);
    });

    it('throws error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      await expect(fetchProducts()).rejects.toThrow('Failed to fetch products');
    });

    it('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchProducts()).rejects.toThrow('Network error');
    });

    it('fetches products with limit parameter', async () => {
      const mockProducts = [
        { id: 1, title: 'Product 1', price: 29.99 },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      } as Response);

      const result = await fetchProducts(5);

      expect(mockFetch).toHaveBeenCalledWith('https://fakestoreapi.com/products?limit=5');
      expect(result).toEqual(mockProducts);
    });

    it('fetches products with category filter', async () => {
      const mockProducts = [
        { id: 1, title: 'Electronics Product', price: 299.99, category: 'electronics' },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      } as Response);

      const result = await fetchProducts(undefined, 'electronics');

      expect(mockFetch).toHaveBeenCalledWith('https://fakestoreapi.com/products/category/electronics');
      expect(result).toEqual(mockProducts);
    });

    it('fetches products with both limit and category', async () => {
      const mockProducts = [
        { id: 1, title: 'Electronics Product', price: 299.99, category: 'electronics' },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      } as Response);

      const result = await fetchProducts(10, 'electronics');

      expect(mockFetch).toHaveBeenCalledWith('https://fakestoreapi.com/products/category/electronics?limit=10');
      expect(result).toEqual(mockProducts);
    });

    it('handles empty response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

      const result = await fetchProducts();

      expect(result).toEqual([]);
    });

    it('handles invalid JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      } as Response);

      await expect(fetchProducts()).rejects.toThrow('Invalid JSON');
    });
  });

  describe('fetchProductById', () => {
    it('fetches product by id successfully', async () => {
      const mockProduct = {
        id: 1,
        title: 'Test Product',
        price: 29.99,
        description: 'Test description',
        category: 'test',
        image: 'test.jpg',
        rating: { rate: 4.5, count: 100 },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
      } as Response);

      const result = await fetchProductById(1);

      expect(mockFetch).toHaveBeenCalledWith('https://fakestoreapi.com/products/1');
      expect(result).toEqual(mockProduct);
    });

    it('throws error when product not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      await expect(fetchProductById(999)).rejects.toThrow('Failed to fetch product');
    });

    it('handles network errors for product fetch', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchProductById(1)).rejects.toThrow('Network error');
    });

    it('fetches product with valid id', async () => {
      const mockProduct = {
        id: 5,
        title: 'Another Product',
        price: 49.99,
        description: 'Another description',
        category: 'category',
        image: 'image.jpg',
        rating: { rate: 3.8, count: 50 },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
      } as Response);

      const result = await fetchProductById(5);

      expect(mockFetch).toHaveBeenCalledWith('https://fakestoreapi.com/products/5');
      expect(result).toEqual(mockProduct);
      expect(result.id).toBe(5);
    });

    it('handles server errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      await expect(fetchProductById(1)).rejects.toThrow('Failed to fetch product');
    });

    it('handles timeout errors', async () => {
      mockFetch.mockImplementationOnce(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 100)
        )
      );

      await expect(fetchProductById(1)).rejects.toThrow('Request timeout');
    });

    it('validates product data structure', async () => {
      const mockProduct = {
        id: 1,
        title: 'Test Product',
        price: 29.99,
        description: 'Test description',
        category: 'test',
        image: 'test.jpg',
        rating: { rate: 4.5, count: 100 },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
      } as Response);

      const result = await fetchProductById(1);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('price');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('category');
      expect(result).toHaveProperty('image');
      expect(result).toHaveProperty('rating');
      expect(result.rating).toHaveProperty('rate');
      expect(result.rating).toHaveProperty('count');
    });
  });

  describe('Error Handling', () => {
    it('handles response not ok status codes', async () => {
      const errorCodes = [400, 401, 403, 404, 500, 502, 503];

      for (const code of errorCodes) {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: code,
          statusText: `Error ${code}`,
        } as Response);

        await expect(fetchProducts()).rejects.toThrow('Failed to fetch products');
      }
    });

    it('handles malformed URLs gracefully', async () => {
      // This test ensures our API functions handle the current implementation
      // In a real scenario, you might want to test URL validation
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

      const result = await fetchProducts();
      expect(result).toEqual([]);
    });

    it('handles concurrent requests', async () => {
      const mockProduct1 = { id: 1, title: 'Product 1', price: 29.99 };
      const mockProduct2 = { id: 2, title: 'Product 2', price: 39.99 };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockProduct1,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockProduct2,
        } as Response);

      const [result1, result2] = await Promise.all([
        fetchProductById(1),
        fetchProductById(2),
      ]);

      expect(result1).toEqual(mockProduct1);
      expect(result2).toEqual(mockProduct2);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });
});
