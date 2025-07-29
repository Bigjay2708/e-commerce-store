import { render, RenderOptions } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'
import { Product, User, CartItem } from '@/types'

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  // Add any custom options here
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

// Mock data generators
export const createMockProduct = (overrides?: Partial<Product>): Product => ({
  id: 1,
  title: 'Test Product',
  price: 29.99,
  description: 'A great test product',
  category: 'electronics',
  image: 'https://example.com/image.jpg',
  rating: {
    rate: 4.5,
    count: 100,
  },
  ...overrides,
})

export const createMockUser = (overrides?: Partial<User>): User => ({
  id: 1,
  email: 'test@example.com',
  username: 'testuser',
  password: 'password123',
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
  ...overrides,
})

export const createMockCartItem = (overrides?: Partial<CartItem>): CartItem => ({
  id: 1,
  title: 'Test Product',
  price: 29.99,
  description: 'A great test product',
  category: 'electronics',
  image: 'https://example.com/image.jpg',
  rating: {
    rate: 4.5,
    count: 100,
  },
  quantity: 1,
  ...overrides,
})

// Test utilities
export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0))

export const mockConsoleError = () => {
  const originalError = console.error
  console.error = vi.fn()
  return () => {
    console.error = originalError
  }
}

// Re-export testing library utilities
export * from '@testing-library/react'
export { userEvent } from '@testing-library/user-event'
