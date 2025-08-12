import Image from 'next/image';
import Link from 'next/link';
import { Product, DbProduct } from '@/types';
import { FaStar } from 'react-icons/fa';
import Button from '@/components/ui/Button';
import { useCartStore } from '@/store/cart';
import WishlistButton from './WishlistButton';
import ComparisonButton from './ComparisonButton';
import SaveForLaterButton from '@/components/ui/SaveForLaterButton';
import { toast } from 'react-hot-toast';
import { useRef, useState } from 'react';
import SocialSharing from './SocialSharing';
import CartFlyout from '@/components/cart/CartFlyout';

interface ProductCardProps {
  product: Product | DbProduct;
}

// Helper function to normalize product data
const normalizeProduct = (product: Product | DbProduct): Product => {
  if ('title' in product) {
    // It's already a legacy Product
    return product;
  }
  
  // Convert DbProduct to Product format
  return {
    id: product.id,
    title: product.name,
    price: product.price,
    description: product.description || '',
    category: 'general', // Default category for database products
    image: product.imageUrl || '/placeholder-image.jpg',
    rating: {
      rate: 4.5, // Default rating until we implement review aggregation
      count: 0
    }
  };
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCartStore();
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Normalize the product to ensure consistent structure
  const normalizedProduct = normalizeProduct(product);

  const handleAddToCart = () => {
    // Animation: clone image and animate to cart icon
    const img = imgRef.current?.querySelector('img');
    if (img) {
      const cartIcon = document.querySelector('[href="/cart"]');
      if (cartIcon) {
        const imgRect = img.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();
        const clone = img.cloneNode(true) as HTMLImageElement;
        clone.style.position = 'fixed';
        clone.style.left = imgRect.left + 'px';
        clone.style.top = imgRect.top + 'px';
        clone.style.width = imgRect.width + 'px';
        clone.style.height = imgRect.height + 'px';
        clone.style.zIndex = '9999';
        clone.style.transition = 'all 0.7s cubic-bezier(0.4,0,0.2,1)';
        document.body.appendChild(clone);
        setTimeout(() => {
          clone.style.left = cartRect.left + 'px';
          clone.style.top = cartRect.top + 'px';
          clone.style.width = '32px';
          clone.style.height = '32px';
          clone.style.opacity = '0.5';
        }, 10);
        setTimeout(() => {
          document.body.removeChild(clone);
        }, 800);
      }
    }
    addToCart(normalizedProduct);
    toast.success(`${normalizedProduct.title} added to cart!`);
    setFlyoutOpen(true);
    setTimeout(() => setFlyoutOpen(false), 2200);
  };

  return (
    <div className="product-card-clean group">
      <div ref={imgRef}>
        <Link href={`/products/${product.id}`} className="block relative h-40 sm:h-48 overflow-hidden bg-gray-50 dark:bg-gray-700">
          <Image
            src={normalizedProduct.image}
            alt={normalizedProduct.title}
            fill
            className="object-contain p-2 sm:p-4 group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 25vw"
            priority={false}
          />
        </Link>
      </div>
      <div className="flex flex-col gap-2 p-2 sm:p-3">
        <div className="flex justify-between items-start gap-2">
          <Link href={`/products/${product.id}`} className="group flex-1">
            <h3 className="text-sm sm:text-lg font-bold text-foreground line-clamp-2 sm:line-clamp-1 group-hover:text-primary transition-colors">
              {normalizedProduct.title}
            </h3>
          </Link>
          <div className="flex items-center space-x-1">
            <SaveForLaterButton product={normalizedProduct} variant="icon" size="sm" />
            <WishlistButton product={normalizedProduct} />
          </div>
        </div>
        <p className="text-xs sm:text-sm text-muted line-clamp-2 font-medium">
          {product.description}
        </p>
        <div className="flex items-center gap-1 sm:gap-2 mt-1">
          <FaStar className="text-yellow-500 text-xs sm:text-sm" />
          <span className="text-xs sm:text-sm font-medium text-foreground">
            {normalizedProduct.rating.rate} <span className="text-muted">({normalizedProduct.rating.count})</span>
          </span>
        </div>
        <div className="mt-2 sm:mt-3 flex items-center justify-between gap-2">
          <span className="text-lg sm:text-xl font-extrabold text-primary">
            ${product.price.toFixed(2)}
          </span>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleAddToCart}
            className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
          >
            Add to cart
          </Button>
        </div>
        <div className="mt-2 sm:mt-3 flex items-center justify-between gap-2">
          <ComparisonButton product={normalizedProduct} className="text-xs sm:text-sm" />
          <SocialSharing product={normalizedProduct} />
        </div>
      </div>
      <CartFlyout open={flyoutOpen} onClose={() => setFlyoutOpen(false)} />
    </div>
  );
};

export default ProductCard;
