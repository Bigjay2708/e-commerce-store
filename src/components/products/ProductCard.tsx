import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { FaStar } from 'react-icons/fa';
import Button from '@/components/ui/Button';
import { useCartStore } from '@/store/cart';
import WishlistButton from './WishlistButton';
import ComparisonButton from './ComparisonButton';
import { toast } from 'react-hot-toast';
import { useRef, useState } from 'react';
import CartFlyout from '@/components/cart/CartFlyout';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCartStore();
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

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
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
    setFlyoutOpen(true);
    setTimeout(() => setFlyoutOpen(false), 2200);
  };

  return (
    <div className="card group relative overflow-hidden transition-transform hover:scale-[1.03] hover:shadow-xl">
      <div ref={imgRef}>
        <Link href={`/products/${product.id}`} className="block relative h-48 overflow-hidden bg-card">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        </Link>
      </div>
      <div className="p-6 flex flex-col gap-2">
        <div className="flex justify-between items-start gap-2">
          <Link href={`/products/${product.id}`} className="group">
            <h3 className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {product.title}
            </h3>
          </Link>
          <WishlistButton product={product} />
        </div>
        <p className="text-sm text-muted line-clamp-2 font-medium">
          {product.description}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <FaStar className="text-yellow-500" />
          <span className="text-sm font-medium text-foreground">
            {product.rating.rate} <span className="text-muted">({product.rating.count} reviews)</span>
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-extrabold text-primary">
            ${product.price.toFixed(2)}
          </span>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleAddToCart}
          >
            Add to cart
          </Button>
        </div>
        <div className="mt-3 flex gap-2">
          <ComparisonButton product={product} className="flex-1" />
        </div>
      </div>
      <CartFlyout open={flyoutOpen} onClose={() => setFlyoutOpen(false)} />
    </div>
  );
};

export default ProductCard;
