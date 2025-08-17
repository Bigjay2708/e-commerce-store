import { describe, it, expect, beforeEach, vi } from 'vitest'
import { customRender, screen, createMockProduct } from '@/test/utils'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import ProductCard from '@/components/products/ProductCard'


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
    

    const addToCartButton = screen.getByText('Add to cart')
    await user.click(addToCartButton)
    

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
    

    const addToCartButton1 = screen.getByText('Add to cart')
    await user.click(addToCartButton1)
    

    rerender(<ProductCard product={product2} />)
    const addToCartButton2 = screen.getByText('Add to cart')
    await user.click(addToCartButton2)
    

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
    
    const addToCartButton = screen.getByText('Add to cart')
    

    await user.click(addToCartButton)
    await user.click(addToCartButton)
    await user.click(addToCartButton)
    

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
    

    const wishlistButton = screen.getByLabelText(/add to wishlist/i)
    await user.click(wishlistButton)
    

    let wishlistState = useWishlistStore.getState()
    expect(wishlistState.items).toHaveLength(1)
    expect(wishlistState.items[0]).toEqual(product)
    

    const addToCartButton = screen.getByText('Add to cart')
    await user.click(addToCartButton)
    

    const cartState = useCartStore.getState().cart
    wishlistState = useWishlistStore.getState()
    
    expect(cartState.items).toHaveLength(1)
    expect(wishlistState.items).toHaveLength(1)
    expect(cartState.items[0].id).toBe(product.id)
    expect(wishlistState.items[0].id).toBe(product.id)
  })

  it('should remove product from cart correctly', async () => {
    const product = createMockProduct({ id: 1, title: 'Test Product', price: 29.99 })
    

    const { addToCart, removeFromCart } = useCartStore.getState()
    addToCart(product)
    

    let cartState = useCartStore.getState().cart
    expect(cartState.items).toHaveLength(1)
    

    removeFromCart(product.id)
    

    cartState = useCartStore.getState().cart
    expect(cartState.items).toHaveLength(0)
    expect(cartState.totalItems).toBe(0)
    expect(cartState.totalPrice).toBe(0)
  })

  it('should update quantity correctly', async () => {
    const product = createMockProduct({ id: 1, title: 'Test Product', price: 29.99 })
    

    const { addToCart, updateQuantity } = useCartStore.getState()
    addToCart(product)
    

    updateQuantity(product.id, 5)
    

    const cartState = useCartStore.getState().cart
    expect(cartState.items[0].quantity).toBe(5)
    expect(cartState.totalItems).toBe(5)
    expect(cartState.totalPrice).toBe(149.95)
  })

  it('should clear cart correctly', async () => {
    const product1 = createMockProduct({ id: 1, title: 'Product 1', price: 29.99 })
    const product2 = createMockProduct({ id: 2, title: 'Product 2', price: 39.99 })
    

    const { addToCart, clearCart } = useCartStore.getState()
    addToCart(product1)
    addToCart(product2)
    

    let cartState = useCartStore.getState().cart
    expect(cartState.items).toHaveLength(2)
    

    clearCart()
    

    cartState = useCartStore.getState().cart
    expect(cartState.items).toHaveLength(0)
    expect(cartState.totalItems).toBe(0)
    expect(cartState.totalPrice).toBe(0)
  })
})
