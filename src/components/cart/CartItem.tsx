import Image from 'next/image';
import { FaTrash } from 'react-icons/fa';
import { CartItem as CartItemType } from '@/types';
import { useCartStore } from '@/store/cart';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCartStore();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantity = parseInt(e.target.value);
    updateQuantity(item.id, newQuantity);
  };

  return (
    <div className="flex items-center py-4 border-b">
      <div className="relative h-20 w-20 flex-shrink-0">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-contain"
          sizes="80px"
        />
      </div>
      
      <div className="ml-4 flex-grow">
        <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
        <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)}</p>
      </div>
      
      <div className="flex items-center space-x-4">
        <select
          value={item.quantity}
          onChange={handleQuantityChange}
          className="rounded border-gray-300 py-1 text-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-red-500 hover:text-red-700 transition-colors"
          aria-label="Remove item"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
