import { describe, it, expect, beforeEach } from 'vitest'
import { useWishlistStore } from '../wishlist'
import { createMockProduct } from '@/test/utils'

describe('Wishlist Store', () => {
  beforeEach(() => {
    // Reset the store before each test
    useWishlistStore.setState({
      items: [],
    })
  })

  describe('addToWishlist', () => {
    it('should add a product to wishlist', () => {
      const product = createMockProduct({ id: 1 })
      const { addToWishlist } = useWishlistStore.getState()

      addToWishlist(product)

      const items = useWishlistStore.getState().items
      expect(items).toHaveLength(1)
      expect(items[0]).toEqual(product)
    })

    it('should not add duplicate products', () => {
      const product = createMockProduct({ id: 1 })
      const { addToWishlist } = useWishlistStore.getState()

      addToWishlist(product)
      addToWishlist(product) // Try to add again

      const items = useWishlistStore.getState().items
      expect(items).toHaveLength(1)
    })

    it('should add multiple different products', () => {
      const product1 = createMockProduct({ id: 1 })
      const product2 = createMockProduct({ id: 2 })
      const { addToWishlist } = useWishlistStore.getState()

      addToWishlist(product1)
      addToWishlist(product2)

      const items = useWishlistStore.getState().items
      expect(items).toHaveLength(2)
    })
  })

  describe('removeFromWishlist', () => {
    it('should remove product from wishlist', () => {
      const product = createMockProduct({ id: 1 })
      const { addToWishlist, removeFromWishlist } = useWishlistStore.getState()

      addToWishlist(product)
      removeFromWishlist(product.id)

      const items = useWishlistStore.getState().items
      expect(items).toHaveLength(0)
    })

    it('should not affect wishlist if product not found', () => {
      const product = createMockProduct({ id: 1 })
      const { addToWishlist, removeFromWishlist } = useWishlistStore.getState()

      addToWishlist(product)
      removeFromWishlist(999) // Non-existent product

      const items = useWishlistStore.getState().items
      expect(items).toHaveLength(1)
    })
  })

  describe('clearWishlist', () => {
    it('should clear all items from wishlist', () => {
      const product1 = createMockProduct({ id: 1 })
      const product2 = createMockProduct({ id: 2 })
      const { addToWishlist, clearWishlist } = useWishlistStore.getState()

      addToWishlist(product1)
      addToWishlist(product2)
      clearWishlist()

      const items = useWishlistStore.getState().items
      expect(items).toHaveLength(0)
    })
  })

  describe('isInWishlist', () => {
    it('should return true for products in wishlist', () => {
      const product = createMockProduct({ id: 1 })
      const { addToWishlist, isInWishlist } = useWishlistStore.getState()

      addToWishlist(product)

      expect(isInWishlist(product.id)).toBe(true)
    })

    it('should return false for products not in wishlist', () => {
      const { isInWishlist } = useWishlistStore.getState()

      expect(isInWishlist(999)).toBe(false)
    })
  })

  describe('item count', () => {
    it('should return correct item count', () => {
      const product1 = createMockProduct({ id: 1 })
      const product2 = createMockProduct({ id: 2 })
      const { addToWishlist } = useWishlistStore.getState()

      expect(useWishlistStore.getState().items).toHaveLength(0)

      addToWishlist(product1)
      expect(useWishlistStore.getState().items).toHaveLength(1)

      addToWishlist(product2)
      expect(useWishlistStore.getState().items).toHaveLength(2)
    })
  })
})
