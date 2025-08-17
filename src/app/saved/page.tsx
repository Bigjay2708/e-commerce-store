"use client";
import { useState, useEffect } from 'react';
import { FaBookmark, FaTrash, FaShoppingCart, FaHeart, FaEdit, FaClock, FaFilter } from 'react-icons/fa';
import { useSavedForLaterStore, SavedItem } from '@/store/savedForLater';
import { useCartStore } from '@/stor                ) : (
                  <div className="space-y-2">art';
import { useWishlistStore } from '@/store/wishlist';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';

const reasonLabels: Record<NonNullable<SavedItem['reason']>, string> = {
  price_check: 'Price Check',
  out_of_stock: 'Out of Stock',
  consider_later: 'Consider Later',
  gift_idea: 'Gift Idea',
  custom: 'Custom'
};

const reasonColors: Record<NonNullable<SavedItem['reason']>, string> = {
  price_check: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  out_of_stock: 'bg-red-100 text-red-800 border-red-300',
  consider_later: 'bg-blue-100 text-blue-800 border-blue-300',
  gift_idea: 'bg-purple-100 text-purple-800 border-purple-300',
  custom: 'bg-gray-100 text-gray-800 border-gray-300'
};

export default function SavedForLaterPage() {
  const { 
    items, 
    removeFromSaved, 
    updateSavedItem, 
    clearSaved, 
    clearExpiredItems,
    getSavedByReason 
  } = useSavedForLaterStore();
  const { addToCart } = useCartStore();
  const { addToWishlist } = useWishlistStore();
  
  const [selectedReason, setSelectedReason] = useState<SavedItem['reason'] | 'all'>('all');
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    reason: 'consider_later' as SavedItem['reason'],
    customReason: '',
    notes: ''
  });

  useEffect(() => {

    clearExpiredItems();
  }, [clearExpiredItems]);

  const filteredItems = selectedReason === 'all' 
    ? items 
    : getSavedByReason(selectedReason);

  const handleMoveToCart = (item: SavedItem) => {
    addToCart(item);
    removeFromSaved(item.id);
    toast.success(`${item.title} moved to cart`);
  };

  const handleMoveToWishlist = (item: SavedItem) => {
    addToWishlist(item);
    removeFromSaved(item.id);
    toast.success(`${item.title} moved to wishlist`);
  };

  const handleRemove = (item: SavedItem) => {
    removeFromSaved(item.id);
    toast.success(`${item.title} removed from saved items`);
  };

  const handleStartEdit = (item: SavedItem) => {
    setEditingItem(item.id);
    setEditForm({
      reason: item.reason || 'consider_later',
      customReason: item.customReason || '',
      notes: item.notes || ''
    });
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      updateSavedItem(editingItem, editForm);
      setEditingItem(null);
      toast.success('Item updated');
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <FaBookmark className="mr-3 text-blue-600" />
            Saved for Later
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {items.length} item{items.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        {items.length > 0 && (
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={clearExpiredItems}
              className="flex items-center space-x-2"
            >
              <FaClock />
              <span>Clear Old Items</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (confirm('Are you sure you want to clear all saved items?')) {
                  clearSaved();
                  toast.success('All saved items cleared');
                }
              }}
              className="flex items-center space-x-2 text-red-600 border-red-600 hover:bg-red-50"
            >
              <FaTrash />
              <span>Clear All</span>
            </Button>
          </div>
        )}
      </div>

      
      {items.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <FaFilter className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by reason:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedReason('all')}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  selectedReason === 'all'
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                }`}
              >
                All ({items.length})
              </button>
              {Object.entries(reasonLabels).map(([key, label]) => {
                const count = getSavedByReason(key as SavedItem['reason']).length;
                if (count === 0) return null;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedReason(key as SavedItem['reason'])}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      selectedReason === key
                        ? reasonColors[key as NonNullable<SavedItem['reason']>]
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {label} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <FaBookmark className="mx-auto text-6xl text-gray-300 mb-6" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            {selectedReason === 'all' ? 'No saved items' : `No items saved for ${reasonLabels[selectedReason as NonNullable<SavedItem['reason']>]}`}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Save items while browsing to review them later
          </p>
          <Link href="/products">
            <Button variant="primary">Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
            >
              
              <div className="relative aspect-square">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 text-xs rounded-full border ${reasonColors[item.reason || 'consider_later']}`}>
                    {item.customReason || reasonLabels[item.reason || 'consider_later']}
                  </span>
                </div>
              </div>

              
              <div className="p-4">
                <Link href={`/products/${item.id}`}>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  ${item.price.toFixed(2)}
                </p>
                
                
                <div className="text-xs text-gray-500 mb-3 flex items-center space-x-2">
                  <FaClock />
                  <span>Saved {formatTimeAgo(item.savedAt)}</span>
                </div>

                
                {item.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    {item.notes}
                  </p>
                )}

                
                {editingItem === item.id ? (
                  <div className="space-y-3 mb-4">
                    <select
                      value={editForm.reason}
                      onChange={(e) => setEditForm({ ...editForm, reason: e.target.value as SavedItem['reason'] })}
                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                    >
                      {Object.entries(reasonLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                    {editForm.reason === 'custom' && (
                      <input
                        type="text"
                        placeholder="Custom reason"
                        value={editForm.customReason}
                        onChange={(e) => setEditForm({ ...editForm, customReason: e.target.value })}
                        className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                      />
                    )}
                    <textarea
                      placeholder="Notes"
                      value={editForm.notes}
                      onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                      rows={2}
                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 resize-none"
                    />
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={handleSaveEdit}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  /* Action Buttons */
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleMoveToCart(item)}
                        className="flex-1 flex items-center justify-center space-x-1"
                      >
                        <FaShoppingCart />
                        <span>Add to Cart</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMoveToWishlist(item)}
                        className="flex items-center justify-center space-x-1"
                      >
                        <FaHeart />
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStartEdit(item)}
                        className="flex-1 flex items-center justify-center space-x-1"
                      >
                        <FaEdit />
                        <span>Edit</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemove(item)}
                        className="flex items-center justify-center space-x-1 text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
