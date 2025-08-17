import axios from 'axios';
import { Product, User } from '@/types';


const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


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


export const fetchOrders = async () => {
  const response = await apiClient.get('/orders');
  return response.data;
};


export const registerUser = async (userData: {
  email: string;
  password: string;
  name: string;
}) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};


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


export const sendEmail = async (emailData: {
  email: string;
  orderData: Record<string, unknown>;
}) => {
  const response = await apiClient.post('/email/send', emailData);
  return response.data;
};



export const fetchProductsByCategory = async (_category: string): Promise<Product[]> => {

  const products = await fetchProducts();
  return products;
};

export const fetchCategories = async (): Promise<string[]> => {

  return ['electronics', 'clothing', 'books'];
};


export const login = async (_username: string, _password: string) => {

  throw new Error('Use NextAuth signIn instead');
};


export const fetchUserById = async (_id: number): Promise<User> => {

  throw new Error('Not implemented - use session data instead');
};
