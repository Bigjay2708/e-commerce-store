"use client";
import { useState } from "react";
import { FaHeart, FaComment, FaCheckCircle, FaInstagram, FaTiktok, FaYoutube, FaTwitter, FaCopy } from "react-icons/fa";
import Link from "next/link";
import UserAvatar from "@/components/user/UserAvatar";
import FollowButton from "@/components/user/FollowButton";
import { useSocialStore } from "@/store/social";
import { toast } from "react-hot-toast";
import Button from "@/components/ui/Button";
import Image from "next/image";

interface InfluencerShowcaseProps {
  productId: number;
}

export default function InfluencerShowcase({ productId }: InfluencerShowcaseProps) {
  const { getProductInfluencerPosts, getInfluencerById } = useSocialStore();
  const [copiedCodes, setCopiedCodes] = useState<{ [key: string]: boolean }>({});

  const influencerPosts = getProductInfluencerPosts(productId);

  if (influencerPosts.length === 0) return null;

  const handleCopyDiscountCode = async (code: string, postId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodes({ ...copiedCodes, [postId]: true });
      toast.success(`Discount code "${code}" copied!`);
      setTimeout(() => {
        setCopiedCodes({ ...copiedCodes, [postId]: false });
      }, 2000);
    } catch {
      toast.error('Failed to copy code');
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <FaInstagram className="text-pink-500" />;
      case 'tiktok': return <FaTiktok className="text-black dark:text-white" />;
      case 'youtube': return <FaYoutube className="text-red-600" />;
      case 'twitter': return <FaTwitter className="text-blue-400" />;
      default: return null;
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Featured by Influencers
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {influencerPosts.map((post) => {
          const influencer = getInfluencerById(post.influencerId);
          if (!influencer) return null;

          return (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Post Media */}
              <div className="relative aspect-square">
                <Image
                  src={post.mediaUrl}
                  alt="Influencer post"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {post.mediaType === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-50 rounded-full p-4">
                      <div className="w-6 h-6 border-l-4 border-l-white border-y-4 border-y-transparent border-r-4 border-r-transparent"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Influencer Info */}
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Link href={`/users/${influencer.id}`} className="flex items-center space-x-2 group">
                    <UserAvatar src={influencer.avatar} alt={influencer.name} size={40} />
                    {influencer.verified && (
                      <FaCheckCircle className="-ml-2 text-blue-500 bg-white rounded-full text-sm" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white group-hover:underline">
                          {influencer.name}
                        </h4>
                        {getPlatformIcon(influencer.platform)}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {influencer.handle} • {formatFollowers(influencer.followers)} followers
                      </p>
                    </div>
                  </Link>
                  <FollowButton userId={influencer.id.toString()} />
                </div>

                {/* Post Content */}
                <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                  {post.content}
                </p>

                {/* Post Stats */}
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <FaHeart className="text-red-500" />
                    <span>{post.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaComment />
                    <span>{post.comments}</span>
                  </div>
                  <span className="text-xs">
                    {new Date(post.date).toLocaleDateString()}
                  </span>
                </div>

                {/* Discount Code */}
                {post.discount && (
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Exclusive Discount</p>
                        <p className="text-lg font-bold">
                          {post.discount.percentage}% OFF
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-90">Use code:</p>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold bg-white bg-opacity-20 px-2 py-1 rounded">
                            {post.discount.code}
                          </span>
                          <button
                            onClick={() => handleCopyDiscountCode(post.discount!.code, post.id)}
                            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                          >
                            {copiedCodes[post.id] ? (
                              <FaCheckCircle className="text-green-300" />
                            ) : (
                              <FaCopy />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 text-center">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Love what you see?
        </h4>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Join thousands of satisfied customers who trust our influencers&apos; recommendations
        </p>
        <div className="flex justify-center space-x-4">
          <Button variant="primary" size="lg">
            Shop Now
          </Button>
          <Button variant="outline" size="lg">
            Follow Influencers
          </Button>
        </div>
      </div>
    </div>
  );
}
