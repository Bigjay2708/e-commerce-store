import { describe, it, expect, vi, beforeEach } from 'vitest'
import { customRender, screen, createMockProduct } from '@/test/utils'
import ProductCard from '../products/ProductCard'

// Mock the stores
const mockAddToCart = vi.fn()
const mockAddToWishlist = vi.fn()
const mockRemoveFromWishlist = vi.fn()
const mockIsInWishlist = vi.fn()

vi.mock('@/store/cart', () => ({
  useCartStore: () => ({
    addToCart: mockAddToCart,
  }),
}))

vi.mock('@/store/wishlist', () => ({
  useWishlistStore: () => ({
    addToWishlist: mockAddToWishlist,
    removeFromWishlist: mockRemoveFromWishlist,
    isInWishlist: mockIsInWishlist,
  }),
}))

describe('ProductCard Component', () => {
  const mockProduct = createMockProduct({
    id: 1,
    title: 'Test Product',
    price: 29.99,
    image: 'https://example.com/image.jpg',
    rating: { rate: 4.5, count: 100 },
  })

  beforeEach(() => {
    vi.clearAllMocks()
    mockIsInWishlist.mockReturnValue(false)
  })

  it('should render product information correctly', () => {
    customRender(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$29.99')).toBeInTheDocument()
    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText('(100 reviews)')).toBeInTheDocument()
  })

  it('should render product image with correct attributes', () => {
    customRender(<ProductCard product={mockProduct} />)
    
    const image = screen.getByAltText('Test Product')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', expect.stringContaining('image.jpg'))
  })

  it('should have correct link to product detail page', () => {
    customRender(<ProductCard product={mockProduct} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/products/1')
  })

  it('should call addToCart when add to cart button is clicked', async () => {
    const { userEvent } = await import('@testing-library/user-event')
    const user = userEvent.setup()
    
    customRender(<ProductCard product={mockProduct} />)
    
    const addToCartButton = screen.getByText('Add to Cart')
    await user.click(addToCartButton)
    
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct)
  })

  it('should call addToWishlist when wishlist button is clicked', async () => {
    const { userEvent } = await import('@testing-library/user-event')
    const user = userEvent.setup()
    
    customRender(<ProductCard product={mockProduct} />)
    
    const wishlistButton = screen.getByLabelText(/add to wishlist/i)
    await user.click(wishlistButton)
    
    expect(mockAddToWishlist).toHaveBeenCalledWith(mockProduct)
  })

  it('should call removeFromWishlist when product is already in wishlist', async () => {
    mockIsInWishlist.mockReturnValue(true)
    
    const { userEvent } = await import('@testing-library/user-event')
    const user = userEvent.setup()
    
    customRender(<ProductCard product={mockProduct} />)
    
    const wishlistButton = screen.getByLabelText(/remove from wishlist/i)
    await user.click(wishlistButton)
    
    expect(mockRemoveFromWishlist).toHaveBeenCalledWith(mockProduct.id)
  })

  it('should display correct rating stars', () => {
    customRender(<ProductCard product={mockProduct} />)
    
    // Should have 4 filled stars and 1 half star for 4.5 rating
    const stars = screen.getAllByTestId(/star/)
    expect(stars).toHaveLength(5)
  })

  it('should handle products with no rating', () => {
    const productWithoutRating = createMockProduct({
      id: 1,
      title: 'Test Product',
      price: 29.99,
      rating: { rate: 0, count: 0 },
    })
    
    customRender(<ProductCard product={productWithoutRating} />)
    
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('(0 reviews)')).toBeInTheDocument()
  })

  it('should truncate long product titles', () => {
    const productWithLongTitle = createMockProduct({
      id: 1,
      title: 'This is a very long product title that should be truncated when displayed on the product card',
      price: 29.99,
    })
    
    customRender(<ProductCard product={productWithLongTitle} />)
    
    const titleElement = screen.getByText(/This is a very long product title/)
    expect(titleElement).toBeInTheDocument()
    expect(titleElement).toHaveClass('line-clamp-2') // Assuming this class is used for truncation
  })
})
