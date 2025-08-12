import axios from 'axios';
import { Product, User } from '@/types';

// Configure axios with security defaults
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error.response?.status, error.message);
    }
    return Promise.reject(error);
  }
);

// Product API functions
export const fetchProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get('/products');
  return response.data;
};

export const fetchProductById = async (id: number): Promise<Product> => {
  const response = await apiClient.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (productData: {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}): Promise<Product> => {
  const response = await apiClient.post('/products', productData);
  return response.data;
};

export const updateProduct = async (id: number, productData: Partial<Product>): Promise<Product> => {
  const response = await apiClient.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await apiClient.delete(`/products/${id}`);
};

// Wishlist API functions
export const fetchWishlist = async () => {
  const response = await apiClient.get('/wishlist');
  return response.data;
};

export const addToWishlist = async (productId: number) => {
  const response = await apiClient.post('/wishlist', { productId });
  return response.data;
};

export const removeFromWishlist = async (productId: number) => {
  await apiClient.delete(`/wishlist/${productId}`);
};

// Orders API functions
export const fetchOrders = async () => {
  const response = await apiClient.get('/orders');
  return response.data;
};

// User API functions
export const registerUser = async (userData: {
  email: string;
  password: string;
  name: string;
}) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

// Payment API functions
export const createPaymentIntent = async (items: Array<{
  productId: number;
  quantity: number;
  price: number;
}>) => {
  const response = await apiClient.post('/payment/create-intent', { items });
  return response.data;
};

export const confirmPayment = async (paymentIntentId: string, userId: string, items: Array<{
  productId: number;
  quantity: number;
  price: number;
}>) => {
  const response = await apiClient.post('/payment/confirm', {
    paymentIntentId,
    userId,
    items,
  });
  return response.data;
};

// File upload function
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await apiClient.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Email API functions
export const sendEmail = async (emailData: {
  email: string;
  orderData: Record<string, unknown>;
}) => {
  const response = await apiClient.post('/email/send', emailData);
  return response.data;
};

// Legacy functions for backward compatibility (will be removed)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fetchProductsByCategory = async (_category: string): Promise<Product[]> => {
  // This would need to be implemented with category filtering in the database
  const products = await fetchProducts();
  return products; // For now, return all products
};

export const fetchCategories = async (): Promise<string[]> => {
  // This would need to be implemented with a categories table
  return ['electronics', 'clothing', 'books']; // Mock categories
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const login = async (_username: string, _password: string) => {
  // This is handled by NextAuth now, keeping for compatibility
  throw new Error('Use NextAuth signIn instead');
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fetchUserById = async (_id: number): Promise<User> => {
  // This would need to be implemented if needed
  throw new Error('Not implemented - use session data instead');
};
