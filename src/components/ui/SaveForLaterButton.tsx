"use client";
import { useState } from 'react';
import { FaBookmark, FaRegBookmark, FaCheck } from 'react-icons/fa';
import { useSavedForLaterStore, SavedItem } from '@/store/savedForLater';
import { Product } from '@/types';
import { toast } from 'react-hot-toast';

interface SaveForLaterButtonProps {
  product: Product;
  variant?: 'icon' | 'button' | 'text';
  size?: 'sm' | 'md' | 'lg';
  showDropdown?: boolean;
  className?: string;
}

const reasonLabels: Record<NonNullable<SavedItem['reason']>, string> = {
  price_check: 'Price Check',
  out_of_stock: 'Out of Stock',
  consider_later: 'Consider Later',
  gift_idea: 'Gift Idea',
  custom: 'Custom'
};

export default function SaveForLaterButton({ 
  product, 
  variant = 'icon', 
  size = 'md',
  showDropdown = false,
  className = ''
}: SaveForLaterButtonProps) {
  const { addToSaved, removeFromSaved, isInSaved } = useSavedForLaterStore();
  const [showReasonSelector, setShowReasonSelector] = useState(false);
  const [customReason, setCustomReason] = useState('');
  const [notes, setNotes] = useState('');
  
  const isSaved = isInSaved(product.id);
  // const savedItem = getSavedItem(product.id); // Reserved for future use
  
  const handleToggleSaved = (reason?: SavedItem['reason']) => {
    if (isSaved) {
      removeFromSaved(product.id);
      toast.success('Removed from Saved for Later');
    } else {
      addToSaved(product, reason, customReason || undefined, notes || undefined);
      toast.success('Saved for Later');
      setShowReasonSelector(false);
      setCustomReason('');
      setNotes('');
    }
  };

  const handleQuickSave = () => {
    if (showDropdown && !isSaved) {
      setShowReasonSelector(true);
    } else {
      handleToggleSaved();
    }
  };

  const buttonSizes = {
    sm: 'text-sm p-1',
    md: 'text-base p-2',
    lg: 'text-lg p-3'
  };

  const iconSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (variant === 'icon') {
    return (
      <div className="relative">
        <button
          onClick={handleQuickSave}
          className={`${buttonSizes[size]} text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors ${className}`}
          title={isSaved ? 'Remove from Saved for Later' : 'Save for Later'}
        >
          {isSaved ? (
            <FaBookmark className={`${iconSizes[size]} text-blue-600`} />
          ) : (
            <FaRegBookmark className={iconSizes[size]} />
          )}
        </button>
        
        {showReasonSelector && (
          <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-64">
            <div className="p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Why are you saving this?
              </h4>
              <div className="space-y-2 mb-3">
                {Object.entries(reasonLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleToggleSaved(key as SavedItem['reason'])}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Custom reason (optional)"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
                <textarea
                  placeholder="Notes (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white resize-none"
                />
              </div>
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => handleToggleSaved('custom')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowReasonSelector(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-2 rounded-md text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <button
        onClick={handleQuickSave}
        className={`flex items-center space-x-2 ${buttonSizes[size]} ${
          isSaved 
            ? 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700' 
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
        } border rounded-lg transition-colors ${className}`}
      >
        {isSaved ? (
          <>
            <FaCheck className={iconSizes[size]} />
            <span>Saved</span>
          </>
        ) : (
          <>
            <FaRegBookmark className={iconSizes[size]} />
            <span>Save for Later</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleQuickSave}
      className={`text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors ${className}`}
    >
      {isSaved ? 'Saved' : 'Save for Later'}
    </button>
  );
}
