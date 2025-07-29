import { describe, it, expect, beforeEach, vi } from 'vitest'
import { customRender, screen, createMockProduct } from '@/test/utils'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import ProductCard from '@/components/products/ProductCard'

// Mock the API calls
vi.mock('@/lib/api', () => ({
  fetchProducts: vi.fn(() => Promise.resolve([
    createMockProduct({ id: 1, title: 'Product 1', price: 29.99 }),
    createMockProduct({ id: 2, title: 'Product 2', price: 39.99 }),
  ])),
  fetchProductById: vi.fn((id: number) => Promise.resolve(
    createMockProduct({ id, title: `Product ${id}`, price: 29.99 })
  )),
}))

describe('Shopping Cart Integration', () => {
  beforeEach(() => {
    // Reset stores before each test
    useCartStore.setState({
      cart: {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      },
    })
    
    useWishlistStore.setState({
      items: [],
    })
  })

  it('should add product to cart and update totals', async () => {
    const product = createMockProduct({ id: 1, title: 'Test Product', price: 29.99 })
    
    customRender(<ProductCard product={product} />)
    
    const { userEvent } = await import('@testing-library/user-event')
    const user = userEvent.setup()
    
    // Click add to cart button
    const addToCartButton = screen.getByText('Add to Cart')
    await user.click(addToCartButton)
    
    // Check cart state
    const cartState = useCartStore.getState().cart
    expect(cartState.items).toHaveLength(1)
    expect(cartState.items[0]).toEqual({
      ...product,
      quantity: 1,
    })
    expect(cartState.totalItems).toBe(1)
    expect(cartState.totalPrice).toBe(29.99)
  })

  it('should handle adding multiple products to cart', async () => {
    const product1 = createMockProduct({ id: 1, title: 'Product 1', price: 29.99 })
    const product2 = createMockProduct({ id: 2, title: 'Product 2', price: 39.99 })
    
    const { rerender } = customRender(<ProductCard product={product1} />)
    
    const { userEvent } = await import('@testing-library/user-event')
    const user = userEvent.setup()
    
    // Add first product
    const addToCartButton1 = screen.getByText('Add to Cart')
    await user.click(addToCartButton1)
    
    // Render second product and add to cart
    rerender(<ProductCard product={product2} />)
    const addToCartButton2 = screen.getByText('Add to Cart')
    await user.click(addToCartButton2)
    
    // Check cart state
    const cartState = useCartStore.getState().cart
    expect(cartState.items).toHaveLength(2)
    expect(cartState.totalItems).toBe(2)
    expect(cartState.totalPrice).toBe(69.98)
  })

  it('should increase quantity when adding same product multiple times', async () => {
    const product = createMockProduct({ id: 1, title: 'Test Product', price: 29.99 })
    
    customRender(<ProductCard product={product} />)
    
    const { userEvent } = await import('@testing-library/user-event')
    const user = userEvent.setup()
    
    const addToCartButton = screen.getByText('Add to Cart')
    
    // Add product multiple times
    await user.click(addToCartButton)
    await user.click(addToCartButton)
    await user.click(addToCartButton)
    
    // Check cart state
    const cartState = useCartStore.getState().cart
    expect(cartState.items).toHaveLength(1)
    expect(cartState.items[0].quantity).toBe(3)
    expect(cartState.totalItems).toBe(3)
    expect(cartState.totalPrice).toBe(89.97)
  })

  it('should handle wishlist and cart interaction', async () => {
    const product = createMockProduct({ id: 1, title: 'Test Product', price: 29.99 })
    
    customRender(<ProductCard product={product} />)
    
    const { userEvent } = await import('@testing-library/user-event')
    const user = userEvent.setup()
    
    // Add to wishlist first
    const wishlistButton = screen.getByLabelText(/add to wishlist/i)
    await user.click(wishlistButton)
    
    // Check wishlist state
    let wishlistState = useWishlistStore.getState()
    expect(wishlistState.items).toHaveLength(1)
    expect(wishlistState.items[0]).toEqual(product)
    
    // Then add to cart
    const addToCartButton = screen.getByText('Add to Cart')
    await user.click(addToCartButton)
    
    // Check both states
    const cartState = useCartStore.getState().cart
    wishlistState = useWishlistStore.getState()
    
    expect(cartState.items).toHaveLength(1)
    expect(wishlistState.items).toHaveLength(1)
    expect(cartState.items[0].id).toBe(product.id)
    expect(wishlistState.items[0].id).toBe(product.id)
  })

  it('should remove product from cart correctly', async () => {
    const product = createMockProduct({ id: 1, title: 'Test Product', price: 29.99 })
    
    // Add product to cart programmatically
    const { addToCart, removeFromCart } = useCartStore.getState()
    addToCart(product)
    
    // Verify it was added
    let cartState = useCartStore.getState().cart
    expect(cartState.items).toHaveLength(1)
    
    // Remove from cart
    removeFromCart(product.id)
    
    // Verify it was removed
    cartState = useCartStore.getState().cart
    expect(cartState.items).toHaveLength(0)
    expect(cartState.totalItems).toBe(0)
    expect(cartState.totalPrice).toBe(0)
  })

  it('should update quantity correctly', async () => {
    const product = createMockProduct({ id: 1, title: 'Test Product', price: 29.99 })
    
    // Add product to cart programmatically
    const { addToCart, updateQuantity } = useCartStore.getState()
    addToCart(product)
    
    // Update quantity
    updateQuantity(product.id, 5)
    
    // Check cart state
    const cartState = useCartStore.getState().cart
    expect(cartState.items[0].quantity).toBe(5)
    expect(cartState.totalItems).toBe(5)
    expect(cartState.totalPrice).toBe(149.95)
  })

  it('should clear cart correctly', async () => {
    const product1 = createMockProduct({ id: 1, title: 'Product 1', price: 29.99 })
    const product2 = createMockProduct({ id: 2, title: 'Product 2', price: 39.99 })
    
    // Add products to cart programmatically
    const { addToCart, clearCart } = useCartStore.getState()
    addToCart(product1)
    addToCart(product2)
    
    // Verify products were added
    let cartState = useCartStore.getState().cart
    expect(cartState.items).toHaveLength(2)
    
    // Clear cart
    clearCart()
    
    // Verify cart is empty
    cartState = useCartStore.getState().cart
    expect(cartState.items).toHaveLength(0)
    expect(cartState.totalItems).toBe(0)
    expect(cartState.totalPrice).toBe(0)
  })
})
