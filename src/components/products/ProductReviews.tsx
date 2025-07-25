"use client";
import { useState } from "react";
import { FaStar, FaThumbsUp, FaReply, FaCamera, FaCheckCircle, FaUserCircle } from "react-icons/fa";
import { useSocialStore } from "@/store/social";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import Button from "@/components/ui/Button";
import { Review, ReviewReply } from "@/types";

interface ProductReviewsProps {
  productId: number;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { data: session } = useSession();
  const { 
    getProductReviews, 
    getAverageRating, 
    addReview, 
    likeReview, 
    addReviewReply 
  } = useSocialStore();
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: '',
    images: [] as string[]
  });
  const [replyForm, setReplyForm] = useState<{ [key: string]: string }>({});
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});

  const reviews = getProductReviews(productId);
  const averageRating = getAverageRating(productId);
  const userId = session?.user?.email || 'anonymous';

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.title.trim() || !reviewForm.comment.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    addReview({
      productId,
      userId,
      userName: session?.user?.name || 'Anonymous User',
      userAvatar: session?.user?.image,
      rating: reviewForm.rating,
      title: reviewForm.title,
      comment: reviewForm.comment,
      images: reviewForm.images,
      verifiedPurchase: Math.random() > 0.3 // Simulate verified purchases
    });

    setReviewForm({ rating: 5, title: '', comment: '', images: [] });
    setShowReviewForm(false);
    toast.success('Review submitted successfully!');
  };

  const handleLikeReview = (reviewId: string) => {
    likeReview(reviewId, userId);
  };

  const handleReplySubmit = (reviewId: string) => {
    const reply = replyForm[reviewId];
    if (!reply?.trim()) return;

    addReviewReply(reviewId, {
      userId,
      userName: session?.user?.name || 'Anonymous User',
      userAvatar: session?.user?.image,
      comment: reply
    });

    setReplyForm({ ...replyForm, [reviewId]: '' });
    toast.success('Reply added!');
  };

  const renderStars = (rating: number, size = 'text-sm') => (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={`${size} ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  const renderRatingStats = () => {
    const ratingCounts = [5, 4, 3, 2, 1].map(star => 
      reviews.filter(r => r.rating === star).length
    );
    const totalReviews = reviews.length;

    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {averageRating.toFixed(1)}
            </div>
            {renderStars(Math.round(averageRating), 'text-lg')}
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Based on {totalReviews} reviews
            </p>
          </div>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star, index) => (
              <div key={star} className="flex items-center space-x-3">
                <span className="text-sm font-medium w-8">{star}★</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: totalReviews ? `${(ratingCounts[index] / totalReviews) * 100}%` : '0%'
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                  {ratingCounts[index]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Customer Reviews
        </h3>
        <Button
          variant="primary"
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          Write a Review
        </Button>
      </div>

      {reviews.length > 0 && renderRatingStats()}

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <h4 className="text-lg font-semibold mb-4">Write Your Review</h4>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className="text-2xl focus:outline-none"
                  >
                    <FaStar
                      className={star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Review Title</label>
              <input
                type="text"
                value={reviewForm.title}
                onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
                placeholder="Summarize your experience..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Your Review</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
                rows={4}
                placeholder="Tell others about your experience..."
                required
              />
            </div>
            <div className="flex space-x-3">
              <Button type="submit" variant="primary">
                Submit Review
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <FaStar className="mx-auto text-4xl text-gray-300 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No reviews yet
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Be the first to share your thoughts about this product
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {review.userAvatar ? (
                    <img
                      src={review.userAvatar}
                      alt={review.userName}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <FaUserCircle className="w-10 h-10 text-gray-400" />
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {review.userName}
                      </span>
                      {review.verifiedPurchase && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <FaCheckCircle className="text-xs" />
                          <span className="text-xs">Verified Purchase</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                {review.title}
              </h5>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {review.comment}
              </p>

              {review.images && review.images.length > 0 && (
                <div className="flex space-x-2 mb-4">
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Review image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLikeReview(review.id)}
                    className={`flex items-center space-x-1 text-sm transition-colors ${
                      review.likes.includes(userId)
                        ? 'text-blue-600'
                        : 'text-gray-500 hover:text-blue-600'
                    }`}
                  >
                    <FaThumbsUp />
                    <span>Helpful ({review.helpfulCount})</span>
                  </button>
                  <button
                    onClick={() => setShowReplies({ ...showReplies, [review.id]: !showReplies[review.id] })}
                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600"
                  >
                    <FaReply />
                    <span>Reply ({review.replies.length})</span>
                  </button>
                </div>
              </div>

              {/* Replies Section */}
              {showReplies[review.id] && (
                <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                  {review.replies.map((reply) => (
                    <div key={reply.id} className="py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                      <div className="flex items-center space-x-2 mb-2">
                        {reply.userAvatar ? (
                          <img
                            src={reply.userAvatar}
                            alt={reply.userName}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <FaUserCircle className="w-6 h-6 text-gray-400" />
                        )}
                        <span className="text-sm font-medium">{reply.userName}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(reply.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 ml-8">
                        {reply.comment}
                      </p>
                    </div>
                  ))}
                  
                  {/* Reply Form */}
                  <div className="mt-4 ml-8">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={replyForm[review.id] || ''}
                        onChange={(e) => setReplyForm({ ...replyForm, [review.id]: e.target.value })}
                        placeholder="Write a reply..."
                        className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleReplySubmit(review.id)}
                        disabled={!replyForm[review.id]?.trim()}
                      >
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
