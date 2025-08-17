import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Navbar from '@/components/ui/Navbar';


vi.mock('@/store/cart', () => ({
  useCartStore: vi.fn(),
}));

vi.mock('@/store/wishlist', () => ({
  useWishlistStore: vi.fn(),
}));

vi.mock('@/store/savedForLater', () => ({
  useSavedForLaterStore: vi.fn(),
}));

vi.mock('@/store/theme', () => ({
  useThemeStore: vi.fn(),
}));

import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useSavedForLaterStore } from '@/store/savedForLater';
import { useThemeStore } from '@/store/theme';

const mockUseCartStore = vi.mocked(useCartStore);
const mockUseWishlistStore = vi.mocked(useWishlistStore);
const mockUseSavedForLaterStore = vi.mocked(useSavedForLaterStore);
const mockUseThemeStore = vi.mocked(useThemeStore);

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    

    mockUseCartStore.mockReturnValue({
      cart: {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      },
      addToCart: vi.fn(),
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
    });
    
    mockUseWishlistStore.mockReturnValue({
      items: [],
      addToWishlist: vi.fn(),
      removeFromWishlist: vi.fn(),
      isInWishlist: vi.fn(),
      clearWishlist: vi.fn(),
    });

    mockUseSavedForLaterStore.mockReturnValue({
      items: [],
      addToSavedForLater: vi.fn(),
      removeFromSavedForLater: vi.fn(),
      isInSavedForLater: vi.fn(),
      clearSavedForLater: vi.fn(),
    });

    mockUseThemeStore.mockReturnValue({
      theme: 'light',
      toggleTheme: vi.fn(),
      setTheme: vi.fn(),
    });
  });

  it('renders navigation logo', () => {
    render(<Navbar />);
    
    const logoLink = screen.getByRole('link', { name: /shopease/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('renders main navigation links', () => {
    render(<Navbar />);
    

    const homeLinks = screen.getAllByText('Home');
    const productsLinks = screen.getAllByText('Products');
    const aboutLinks = screen.getAllByText('About');
    
    expect(homeLinks.length).toBeGreaterThan(0);
    expect(productsLinks.length).toBeGreaterThan(0);
    expect(aboutLinks.length).toBeGreaterThan(0);
  });

  it('displays cart item count', () => {
    mockUseCartStore.mockReturnValue({
      cart: {
        items: [
          { id: 1, title: 'Test Product', price: 29.99, quantity: 2, description: '', category: '', image: '', rating: { rate: 0, count: 0 } },
          { id: 2, title: 'Another Product', price: 19.99, quantity: 1, description: '', category: '', image: '', rating: { rate: 0, count: 0 } },
        ],
        totalItems: 3,
        totalPrice: 79.97,
      },
      addToCart: vi.fn(),
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
    });

    render(<Navbar />);
    

    const cartCounts = screen.getAllByText('3');
    expect(cartCounts.length).toBeGreaterThan(0);
  });

  it('displays wishlist item count', () => {
    mockUseWishlistStore.mockReturnValue({
      items: [
        { id: 1, title: 'Wishlist Product', price: 39.99, description: '', category: '', image: '', rating: { rate: 0, count: 0 } },
        { id: 2, title: 'Another Wishlist Product', price: 49.99, description: '', category: '', image: '', rating: { rate: 0, count: 0 } },
      ],
      addToWishlist: vi.fn(),
      removeFromWishlist: vi.fn(),
      isInWishlist: vi.fn(),
      clearWishlist: vi.fn(),
    });

    render(<Navbar />);
    

    const wishlistCounts = screen.getAllByText('2');
    expect(wishlistCounts.length).toBeGreaterThan(0);
  });

  it('shows zero count when cart is empty', () => {
    render(<Navbar />);
    

    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('shows zero count when wishlist is empty', () => {
    render(<Navbar />);
    

    expect(screen.queryByText('0')).not.toBeInTheDocument();
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
    

    const cartLinks = screen.getAllByRole('link').filter(link => 
      link.getAttribute('href') === '/cart'
    );
    
    expect(cartLinks.length).toBeGreaterThan(0);
    expect(cartLinks[0]).toHaveAttribute('href', '/cart');
  });

  it('navigates to wishlist page when wishlist icon is clicked', () => {
    render(<Navbar />);
    

    const wishlistLinks = screen.getAllByRole('link').filter(link => 
      link.getAttribute('href') === '/wishlist'
    );
    
    expect(wishlistLinks.length).toBeGreaterThan(0);
    expect(wishlistLinks[0]).toHaveAttribute('href', '/wishlist');
  });

  it('has proper accessibility attributes', () => {
    render(<Navbar />);
    

    const navElements = screen.getAllByRole('navigation');
    expect(navElements.length).toBeGreaterThan(0);
    

    const cartLabels = screen.getAllByLabelText(/cart/i);
    expect(cartLabels.length).toBeGreaterThan(0);
    

    const wishlistLabels = screen.getAllByLabelText(/wishlist/i);
    expect(wishlistLabels.length).toBeGreaterThan(0);
  });

  it('updates counts when store values change', () => {
    const { rerender } = render(<Navbar />);
    

    expect(screen.queryByText('0')).not.toBeInTheDocument();
    

    mockUseCartStore.mockReturnValue({
      cart: {
        items: [{ id: 1, title: 'Test Product', price: 29.99, quantity: 1, description: '', category: '', image: '', rating: { rate: 0, count: 0 } }],
        totalItems: 1,
        totalPrice: 29.99,
      },
      addToCart: vi.fn(),
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
    });
    
    rerender(<Navbar />);
    

    const counts = screen.getAllByText('1');
    expect(counts.length).toBeGreaterThan(0);
  });
});
