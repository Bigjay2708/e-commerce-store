import axios from 'axios';
import { Product, User } from '@/types';

const API_URL = process.env.FAKE_STORE_API_URL || 'https://fakestoreapi.com';

// Configure axios with security defaults
const apiClient = axios.create({
  baseURL: API_URL,
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

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get('/products');
  return response.data;
};

export const fetchProductById = async (id: number): Promise<Product> => {
  const response = await apiClient.get(`/products/${id}`);
  return response.data;
};

export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  const response = await apiClient.get(`/products/category/${category}`);
  return response.data;
};

export const fetchCategories = async (): Promise<string[]> => {
  const response = await apiClient.get('/products/categories');
  return response.data;
};

export const login = async (username: string, password: string) => {
  try {
    const response = await apiClient.post('/auth/login', {
      username,
      password,
    });
    return response.data;  } catch {
    throw new Error('Invalid credentials');
  }
};

export const fetchUserById = async (id: number): Promise<User> => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};
