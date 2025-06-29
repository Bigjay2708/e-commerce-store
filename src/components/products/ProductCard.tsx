import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { FaStar } from 'react-icons/fa';
import Button from '@/components/ui/Button';
import { useCartStore } from '@/store/cart';
import WishlistButton from './WishlistButton';
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
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-xl border border-gray-100">
      <div ref={imgRef}>
        <Link href={`/products/${product.id}`} className="block relative h-48 overflow-hidden bg-white">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-4 hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start gap-2">
          <Link href={`/products/${product.id}`} className="group">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {product.title}
            </h3>
          </Link>
          <WishlistButton product={product} />
        </div>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2 font-medium">
          {product.description}
        </p>
        <div className="mt-3 flex items-center">
          <FaStar className="text-yellow-500" />
          <span className="ml-1.5 text-sm font-medium text-gray-700">
            {product.rating.rate} ({product.rating.count} reviews)
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">
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
      </div>
      <CartFlyout open={flyoutOpen} onClose={() => setFlyoutOpen(false)} />
    </div>
  );
};

export default ProductCard;
