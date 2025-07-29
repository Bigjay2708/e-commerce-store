import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from '../cart'
import { createMockProduct } from '@/test/utils'

describe('Cart Store', () => {
  beforeEach(() => {
    // Reset the store before each test
    useCartStore.setState({
      cart: {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      },
    })
  })

  describe('addToCart', () => {
    it('should add a new product to cart', () => {
      const product = createMockProduct({ id: 1, price: 29.99 })
      const { addToCart } = useCartStore.getState()

      addToCart(product)

      const updatedCart = useCartStore.getState().cart
      expect(updatedCart.items).toHaveLength(1)
      expect(updatedCart.items[0]).toEqual({
        ...product,
        quantity: 1,
      })
      expect(updatedCart.totalItems).toBe(1)
      expect(updatedCart.totalPrice).toBe(29.99)
    })

    it('should increase quantity when adding existing product', () => {
      const product = createMockProduct({ id: 1, price: 29.99 })
      const { addToCart } = useCartStore.getState()

      // Add product twice
      addToCart(product)
      addToCart(product)

      const cart = useCartStore.getState().cart
      expect(cart.items).toHaveLength(1)
      expect(cart.items[0].quantity).toBe(2)
      expect(cart.totalItems).toBe(2)
      expect(cart.totalPrice).toBe(59.98)
    })

    it('should handle multiple different products', () => {
      const product1 = createMockProduct({ id: 1, price: 29.99 })
      const product2 = createMockProduct({ id: 2, price: 39.99 })
      const { addToCart } = useCartStore.getState()

      addToCart(product1)
      addToCart(product2)

      const cart = useCartStore.getState().cart
      expect(cart.items).toHaveLength(2)
      expect(cart.totalItems).toBe(2)
      expect(cart.totalPrice).toBe(69.98)
    })
  })

  describe('removeFromCart', () => {
    it('should remove product from cart', () => {
      const product = createMockProduct({ id: 1, price: 29.99 })
      const { addToCart, removeFromCart } = useCartStore.getState()

      addToCart(product)
      removeFromCart(product.id)

      const cart = useCartStore.getState().cart
      expect(cart.items).toHaveLength(0)
      expect(cart.totalItems).toBe(0)
      expect(cart.totalPrice).toBe(0)
    })

    it('should not affect cart if product not found', () => {
      const product = createMockProduct({ id: 1, price: 29.99 })
      const { addToCart, removeFromCart } = useCartStore.getState()

      addToCart(product)
      removeFromCart(999) // Non-existent product

      const cart = useCartStore.getState().cart
      expect(cart.items).toHaveLength(1)
      expect(cart.totalItems).toBe(1)
      expect(cart.totalPrice).toBe(29.99)
    })
  })

  describe('updateQuantity', () => {
    it('should update product quantity', () => {
      const product = createMockProduct({ id: 1, price: 29.99 })
      const { addToCart, updateQuantity } = useCartStore.getState()

      addToCart(product)
      updateQuantity(product.id, 5)

      const cart = useCartStore.getState().cart
      expect(cart.items[0].quantity).toBe(5)
      expect(cart.totalItems).toBe(5)
      expect(cart.totalPrice).toBe(149.95)
    })

    it('should update product quantity to 0', () => {
      const product = createMockProduct({ id: 1, price: 29.99 })
      const { addToCart, updateQuantity } = useCartStore.getState()

      addToCart(product)
      updateQuantity(product.id, 0)

      const cart = useCartStore.getState().cart
      expect(cart.items).toHaveLength(1)
      expect(cart.items[0].quantity).toBe(0)
      expect(cart.totalItems).toBe(0)
      expect(cart.totalPrice).toBe(0)
    })

    it('should not update if product not found', () => {
      const product = createMockProduct({ id: 1, price: 29.99 })
      const { addToCart, updateQuantity } = useCartStore.getState()

      addToCart(product)
      updateQuantity(999, 5) // Non-existent product

      const cart = useCartStore.getState().cart
      expect(cart.items[0].quantity).toBe(1)
      expect(cart.totalItems).toBe(1)
      expect(cart.totalPrice).toBe(29.99)
    })
  })

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const product1 = createMockProduct({ id: 1, price: 29.99 })
      const product2 = createMockProduct({ id: 2, price: 39.99 })
      const { addToCart, clearCart } = useCartStore.getState()

      addToCart(product1)
      addToCart(product2)
      clearCart()

      const cart = useCartStore.getState().cart
      expect(cart.items).toHaveLength(0)
      expect(cart.totalItems).toBe(0)
      expect(cart.totalPrice).toBe(0)
    })
  })

  describe('cart calculations', () => {
    it('should calculate totals correctly with decimal prices', () => {
      const product1 = createMockProduct({ id: 1, price: 10.99 })
      const product2 = createMockProduct({ id: 2, price: 15.50 })
      const { addToCart } = useCartStore.getState()

      addToCart(product1)
      addToCart(product1) // quantity: 2
      addToCart(product2)

      const cart = useCartStore.getState().cart
      expect(cart.totalItems).toBe(3)
      expect(cart.totalPrice).toBeCloseTo(37.48, 2) // (10.99 * 2) + 15.50
    })
  })
})
