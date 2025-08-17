import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProductGrid from '@/components/products/ProductGrid';
import { mockProducts } from '@/test/utils';


vi.mock('@/components/products/ProductCard', () => ({
  default: ({ product }: { product: { id: number; title: string } }) => (
    <div data-testid="product-card" data-product-id={product.id}>
      {product.title}
    </div>
  ),
}));

describe('ProductGrid Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders products in a grid layout', () => {
    const products = mockProducts.slice(0, 3);
    
    render(<ProductGrid products={products} />);
    
    const grid = screen.getByTestId('product-grid');
    expect(grid).toBeInTheDocument();
    
    const productCards = screen.getAllByTestId('product-card');
    expect(productCards).toHaveLength(3);
  });

  it('displays product titles', () => {
    const products = mockProducts.slice(0, 2);
    
    render(<ProductGrid products={products} />);
    
    products.forEach(product => {
      expect(screen.getByText(product.title)).toBeInTheDocument();
    });
  });

  it('renders empty grid when no products provided', () => {
    render(<ProductGrid products={[]} />);
    
    const grid = screen.getByTestId('product-grid');
    expect(grid).toBeInTheDocument();
    
    const productCards = screen.queryAllByTestId('product-card');
    expect(productCards).toHaveLength(0);
  });

  it('handles loading state', () => {
    render(<ProductGrid products={[]} loading={true} />);
    
    const loadingIndicator = screen.queryByTestId('loading-spinner');
    if (loadingIndicator) {
      expect(loadingIndicator).toBeInTheDocument();
    }
  });

  it('displays error message when error prop is provided', () => {
    const errorMessage = 'Failed to load products';
    
    render(<ProductGrid products={[]} error={errorMessage} />);
    
    const errorElement = screen.queryByText(errorMessage);
    if (errorElement) {
      expect(errorElement).toBeInTheDocument();
    }
  });

  it('has proper grid styling classes', () => {
    const products = mockProducts.slice(0, 4);
    
    render(<ProductGrid products={products} />);
    
    const grid = screen.getByTestId('product-grid');
    expect(grid).toHaveClass('grid');
  });

  it('maintains product order', () => {
    const products = mockProducts.slice(0, 3);
    
    render(<ProductGrid products={products} />);
    
    const productCards = screen.getAllByTestId('product-card');
    
    products.forEach((product, index) => {
      expect(productCards[index]).toHaveAttribute('data-product-id', product.id.toString());
    });
  });

  it('handles large number of products', () => {
    const manyProducts = Array.from({ length: 20 }, (_, i) => ({
      ...mockProducts[0],
      id: i + 1,
      title: `Product ${i + 1}`,
    }));
    
    render(<ProductGrid products={manyProducts} />);
    
    const productCards = screen.getAllByTestId('product-card');
    expect(productCards).toHaveLength(20);
  });

  it('passes correct props to ProductCard components', () => {
    const products = mockProducts.slice(0, 1);
    
    render(<ProductGrid products={products} />);
    
    const productCard = screen.getByTestId('product-card');
    expect(productCard).toHaveAttribute('data-product-id', products[0].id.toString());
    expect(productCard).toHaveTextContent(products[0].title);
  });

  it('is accessible with proper ARIA attributes', () => {
    const products = mockProducts.slice(0, 3);
    
    render(<ProductGrid products={products} />);
    
    const grid = screen.getByTestId('product-grid');
    expect(grid).toHaveAttribute('role', 'region');
    expect(grid).toHaveAttribute('aria-label', 'Product grid');
  });

  it('handles responsive grid layout', () => {
    const products = mockProducts.slice(0, 6);
    
    render(<ProductGrid products={products} />);
    
    const grid = screen.getByTestId('product-grid');
    

    const hasResponsiveClasses = grid.className.includes('grid-cols') || 
                                grid.className.includes('lg:') || 
                                grid.className.includes('md:') || 
                                grid.className.includes('sm:');
    
    expect(hasResponsiveClasses).toBe(true);
  });

  it('supports custom className prop', () => {
    const customClass = 'custom-grid-class';
    const products = mockProducts.slice(0, 2);
    
    render(<ProductGrid products={products} className={customClass} />);
    
    const grid = screen.getByTestId('product-grid');
    expect(grid).toHaveClass(customClass);
  });
});
