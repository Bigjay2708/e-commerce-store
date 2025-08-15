import { describe, it, expect, vi, beforeEach, afterEach, type MockedFunction } from 'vitest';

// Mock axios before any imports
vi.mock('axios', () => {
  const mockInstance = {
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    },
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };

  return {
    default: {
      create: vi.fn(() => mockInstance),
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    }
  };
});

// Import API functions after mocking axios
import { fetchProducts, fetchProductById } from '@/lib/api';
import axios from 'axios';

// Get the mocked axios instance
const mockedAxios = vi.mocked(axios);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockAxiosInstance = (mockedAxios.create as any)();

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

      mockAxiosInstance.get.mockResolvedValueOnce({
        data: mockProducts,
      });

      const result = await fetchProducts();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products');
      expect(result).toEqual(mockProducts);
    });

    it('throws error when request fails', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchProducts()).rejects.toThrow('Network error');
    });

    it('handles server errors', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce({
        response: { status: 500, statusText: 'Internal Server Error' },
      });

      await expect(fetchProducts()).rejects.toBeTruthy();
    });

    it('handles empty response', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({
        data: [],
      });

      const result = await fetchProducts();
      expect(result).toEqual([]);
    });

    it('makes request to correct URL', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: [] });

      await fetchProducts();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products');
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

      mockAxiosInstance.get.mockResolvedValueOnce({
        data: mockProduct,
      });

      const result = await fetchProductById(1);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products/1');
      expect(result).toEqual(mockProduct);
    });

    it('throws error when product not found', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce({
        response: { status: 404, statusText: 'Not Found' },
      });

      await expect(fetchProductById(999)).rejects.toBeTruthy();
    });

    it('handles network errors for product fetch', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('Network error'));

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

      mockAxiosInstance.get.mockResolvedValueOnce({
        data: mockProduct,
      });

      const result = await fetchProductById(5);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products/5');
      expect(result).toEqual(mockProduct);
      expect(result.id).toBe(5);
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

      mockAxiosInstance.get.mockResolvedValueOnce({
        data: mockProduct,
      });

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
    it('handles different types of errors', async () => {
      // Network error
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('Network error'));
      await expect(fetchProducts()).rejects.toThrow('Network error');

      // Server error
      mockAxiosInstance.get.mockRejectedValueOnce({
        response: { status: 500, statusText: 'Server Error' },
      });
      await expect(fetchProducts()).rejects.toBeTruthy();
    });

    it('handles concurrent requests', async () => {
      const mockProduct1 = { id: 1, title: 'Product 1', price: 29.99 };
      const mockProduct2 = { id: 2, title: 'Product 2', price: 39.99 };

      mockAxiosInstance.get
        .mockResolvedValueOnce({ data: mockProduct1 })
        .mockResolvedValueOnce({ data: mockProduct2 });

      const [result1, result2] = await Promise.all([
        fetchProductById(1),
        fetchProductById(2),
      ]);

      expect(result1).toEqual(mockProduct1);
      expect(result2).toEqual(mockProduct2);
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
    });
  });
});
