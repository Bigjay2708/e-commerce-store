import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useWishlistStore } from '@/store/wishlist';
import { Product } from '@/types';
import { toast } from 'react-hot-toast';

interface WishlistButtonProps {
  product: Product;
  className?: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ product, className = '' }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  const toggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success(`${product.title} removed from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`${product.title} added to wishlist`);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${className}`}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {inWishlist ? (
        <FaHeart className="text-red-500" />
      ) : (
        <FaRegHeart className="text-gray-600 hover:text-red-500" />
      )}
    </button>
  );
};

export default WishlistButton;
