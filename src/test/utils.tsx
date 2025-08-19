import { render, RenderOptions } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'
import { vi } from 'vitest'
import { Product, User, CartItem } from '@/types'


interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialProps?: Record<string, unknown>;
}

export const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => {
  const Wrapper = ({ children }: { children: ReactNode }) => {
    return <>{children}</>
  }

  return render(ui, { wrapper: Wrapper, ...options })
}


export const createMockProduct = (overrides?: Partial<Product>): Product => ({
  id: 1,
  title: 'Test Product',
  price: 29.99,
  description: 'A great test product',
  category: 'electronics',
  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
  rating: {
    rate: 4.5,
    count: 100,
  },
  ...overrides,
})

export const mockProducts: Product[] = [
  createMockProduct({ id: 1, title: 'Product 1', price: 10.99 }),
  createMockProduct({ id: 2, title: 'Product 2', price: 15.50 }),
  createMockProduct({ id: 3, title: 'Product 3', price: 20.00 }),
  createMockProduct({ id: 4, title: 'Product 4', price: 25.99 }),
  createMockProduct({ id: 5, title: 'Product 5', price: 30.00 }),
]

export const createMockUser = (overrides?: Partial<User>): User => ({
  id: 1,
  email: 'test@example.com',
  username: 'testuser',
  name: {
    firstname: 'John',
    lastname: 'Doe',
  },
  address: {
    city: 'San Francisco',
    street: '123 Main St',
    number: 123,
    zipcode: '94105',
    geolocation: {
      lat: '37.7749',
      long: '-122.4194',
    },
  },
  phone: '555-1234',
  followers: [],
  following: [],
  joined: '2024-01-01',
  ...overrides,
})

export const createMockCartItem = (overrides?: Partial<CartItem>): CartItem => ({
  id: 1,
  title: 'Test Product',
  price: 29.99,
  description: 'A great test product',
  category: 'electronics',
  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
  rating: {
    rate: 4.5,
    count: 100,
  },
  quantity: 1,
  ...overrides,
})


export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0))

export const mockConsoleError = () => {
  const originalError = console.error
  console.error = vi.fn()
  return () => {
    console.error = originalError
  }
}


export * from '@testing-library/react'
export { userEvent } from '@testing-library/user-event'
