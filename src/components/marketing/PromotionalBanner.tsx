'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useMarketingStore } from '@/store/marketing'
import { X } from 'lucide-react'

interface PromotionalBannerProps {
  location: 'homepage' | 'product' | 'cart' | 'checkout'
  className?: string
}

export default function PromotionalBanner({ location, className = '' }: PromotionalBannerProps) {
  const { banners, trackBannerView, trackBannerClick } = useMarketingStore()
  const [dismissedBanners, setDismissedBanners] = useState<Set<string>>(new Set())

  // Get active banners for this location
  const activeBanners = banners.filter(banner => 
    banner.location === location && 
    banner.isActive &&
    new Date() >= banner.startDate &&
    new Date() <= banner.endDate &&
    !dismissedBanners.has(banner.id)
  )

  // Track banner views on mount
  useEffect(() => {
    activeBanners.forEach(banner => {
      trackBannerView(banner.id)
    })
  }, [activeBanners, trackBannerView])

  const handleBannerClick = (bannerId: string) => {
    trackBannerClick(bannerId)
  }

  const handleDismiss = (bannerId: string) => {
    setDismissedBanners(prev => new Set(prev).add(bannerId))
  }

  if (activeBanners.length === 0) {
    return null
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {activeBanners.map((banner) => (
        <div key={banner.id} className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-4 text-white">
            {/* Banner Content */}
            <div className="flex-1 flex items-center space-x-4">
              {banner.imageUrl && (
                <div className="flex-shrink-0">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-bold text-lg">{banner.title}</h3>
                {banner.description && (
                  <p className="text-blue-100 text-sm mt-1">{banner.description}</p>
                )}
              </div>
              {banner.ctaText && banner.ctaUrl && (
                <Link
                  href={banner.ctaUrl}
                  onClick={() => handleBannerClick(banner.id)}
                  className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition-colors"
                >
                  {banner.ctaText}
                </Link>
              )}
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => handleDismiss(banner.id)}
              className="flex-shrink-0 ml-4 p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
