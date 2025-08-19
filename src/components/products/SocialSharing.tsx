"use client";
import { useState } from "react";
import Image from "next/image";
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaPinterest, 
  FaWhatsapp, 
  FaEnvelope,
  FaShare,
  FaCopy,
  FaCheck
} from "react-icons/fa";
import { Product, SocialShare } from "@/types";
import { toast } from "react-hot-toast";
import Button from "@/components/ui/Button";

interface SocialSharingProps {
  product: Product;
}

export default function SocialSharing({ product }: SocialSharingProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const productUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/products/${product.id}`
    : '';
  
  const shareText = `Check out this amazing ${product.title}! Only $${product.price}`;
  
  const socialPlatforms: SocialShare[] = [
    {
      platform: 'facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
      text: shareText
    },
    {
      platform: 'twitter',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`,
      text: shareText,
      hashtags: ['shopping', 'deals', 'ecommerce']
    },
    {
      platform: 'pinterest',
      url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(productUrl)}&description=${encodeURIComponent(shareText)}`,
      text: shareText
    },
    {
      platform: 'whatsapp',
      url: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${productUrl}`)}`,
      text: shareText
    },
    {
      platform: 'email',
      url: `mailto:?subject=${encodeURIComponent(`Check out: ${product.title}`)}&body=${encodeURIComponent(`${shareText}\n\n${productUrl}`)}`,
      text: shareText
    }
  ];

  const handleShare = (platform: SocialShare) => {
    if (platform.platform === 'email') {
      window.location.href = platform.url;
    } else {
      window.open(platform.url, '_blank', 'width=600,height=400');
    }
    toast.success(`Shared on ${platform.platform}!`);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <FaFacebook className="text-blue-600" />;
      case 'twitter': return <FaTwitter className="text-blue-400" />;
      case 'instagram': return <FaInstagram className="text-pink-500" />;
      case 'pinterest': return <FaPinterest className="text-red-600" />;
      case 'whatsapp': return <FaWhatsapp className="text-green-500" />;
      case 'email': return <FaEnvelope className="text-gray-600" />;
      default: return <FaShare />;
    }
  };

  const getPlatformName = (platform: string) => {
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowShareModal(true)}
        className="flex items-center space-x-2"
      >
        <FaShare />
        <span>Share</span>
      </Button>

      
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Share this product
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            
            <div className="flex items-center space-x-3 mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Image
                src={product.image}
                alt={product.title}
                width={48}
                height={48}
                className="w-12 h-12 object-contain rounded"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {product.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ${product.price}
                </p>
              </div>
            </div>

            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {socialPlatforms.map((platform) => (
                <button
                  key={platform.platform}
                  onClick={() => handleShare(platform)}
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  {getPlatformIcon(platform.platform)}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {getPlatformName(platform.platform)}
                  </span>
                </button>
              ))}
            </div>

            
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={productUrl}
                  readOnly
                  className="flex-1 p-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                />
                <button
                  onClick={handleCopyLink}
                  className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  {copied ? <FaCheck /> : <FaCopy />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Copy link to share anywhere
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
