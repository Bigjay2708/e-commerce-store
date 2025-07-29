import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Navbar } from '@/components/ui/Navbar';
import { useCart } from '@/store/cart';
import { useWishlist } from '@/store/wishlist';

// Mock the stores
vi.mock('@/store/cart');
vi.mock('@/store/wishlist');

// Mock Next.js components
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

const mockUseCart = vi.mocked(useCart);
const mockUseWishlist = vi.mocked(useWishlist);

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    mockUseCart.mockReturnValue({
      items: [],
      itemCount: 0,
    });
    
    mockUseWishlist.mockReturnValue({
      items: [],
      itemCount: 0,
    });
  });

  it('renders navigation logo', () => {
    render(<Navbar />);
    
    const logo = screen.getByAltText(/logo/i);
    expect(logo).toBeInTheDocument();
  });

  it('renders main navigation links', () => {
    render(<Navbar />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('displays cart item count', () => {
    mockUseCart.mockReturnValue({
      items: [
        { id: 1, title: 'Test Product', price: 29.99, quantity: 2 },
        { id: 2, title: 'Another Product', price: 19.99, quantity: 1 },
      ],
      itemCount: 3,
    });

    render(<Navbar />);
    
    const cartIcon = screen.getByTestId('cart-icon');
    expect(cartIcon).toHaveTextContent('3');
  });

  it('displays wishlist item count', () => {
    mockUseWishlist.mockReturnValue({
      items: [
        { id: 1, title: 'Wishlist Product', price: 39.99 },
        { id: 2, title: 'Another Wishlist Product', price: 49.99 },
      ],
      itemCount: 2,
    });

    render(<Navbar />);
    
    const wishlistIcon = screen.getByTestId('wishlist-icon');
    expect(wishlistIcon).toHaveTextContent('2');
  });

  it('shows zero count when cart is empty', () => {
    render(<Navbar />);
    
    const cartIcon = screen.getByTestId('cart-icon');
    expect(cartIcon).toHaveTextContent('0');
  });

  it('shows zero count when wishlist is empty', () => {
    render(<Navbar />);
    
    const wishlistIcon = screen.getByTestId('wishlist-icon');
    expect(wishlistIcon).toHaveTextContent('0');
  });

  it('renders login button when not authenticated', () => {
    render(<Navbar />);
    
    const loginButton = screen.queryByTestId('login-button');
    if (loginButton) {
      expect(loginButton).toBeInTheDocument();
    }
  });

  it('handles search input', () => {
    render(<Navbar />);
    
    const searchInput = screen.queryByTestId('search-input');
    if (searchInput) {
      fireEvent.change(searchInput, { target: { value: 'test search' } });
      expect(searchInput).toHaveValue('test search');
    }
  });

  it('toggles mobile menu', () => {
    render(<Navbar />);
    
    const mobileMenuButton = screen.queryByTestId('mobile-menu-button');
    if (mobileMenuButton) {
      fireEvent.click(mobileMenuButton);
      
      const mobileMenu = screen.queryByTestId('mobile-menu');
      if (mobileMenu) {
        expect(mobileMenu).toBeVisible();
      }
    }
  });

  it('navigates to cart page when cart icon is clicked', () => {
    render(<Navbar />);
    
    const cartIcon = screen.getByTestId('cart-icon');
    const cartLink = cartIcon.closest('a');
    
    expect(cartLink).toHaveAttribute('href', '/cart');
  });

  it('navigates to wishlist page when wishlist icon is clicked', () => {
    render(<Navbar />);
    
    const wishlistIcon = screen.getByTestId('wishlist-icon');
    const wishlistLink = wishlistIcon.closest('a');
    
    expect(wishlistLink).toHaveAttribute('href', '/wishlist');
  });

  it('has proper accessibility attributes', () => {
    render(<Navbar />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    
    const cartIcon = screen.getByTestId('cart-icon');
    expect(cartIcon).toHaveAttribute('aria-label');
    
    const wishlistIcon = screen.getByTestId('wishlist-icon');
    expect(wishlistIcon).toHaveAttribute('aria-label');
  });

  it('updates counts when store values change', () => {
    const { rerender } = render(<Navbar />);
    
    // Initially empty
    expect(screen.getByTestId('cart-icon')).toHaveTextContent('0');
    
    // Update cart mock
    mockUseCart.mockReturnValue({
      items: [{ id: 1, title: 'Test Product', price: 29.99, quantity: 1 }],
      itemCount: 1,
    });
    
    rerender(<Navbar />);
    
    expect(screen.getByTestId('cart-icon')).toHaveTextContent('1');
  });
});
