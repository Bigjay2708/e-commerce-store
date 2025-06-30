"use client";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export default function ProductReviews({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(`reviews-${productId}`);
    if (stored) setReviews(JSON.parse(stored));
  }, [productId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview: Review = {
      name: name || "Anonymous",
      rating,
      comment,
      date: new Date().toLocaleDateString(),
    };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem(`reviews-${productId}` , JSON.stringify(updated));
    setName("");
    setRating(5);
    setComment("");
  };

  const avgRating = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      {avgRating && (
        <div className="flex items-center mb-2">
          <FaStar className="text-yellow-500" />
          <span className="ml-2 font-semibold">{avgRating} / 5</span>
          <span className="ml-2 text-gray-500">({reviews.length} review{reviews.length !== 1 && "s"})</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4 mb-2">
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={e => setName(e.target.value)}
            className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
          <select
            value={rating}
            onChange={e => setRating(Number(e.target.value))}
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          >
            {[5,4,3,2,1].map(n => (
              <option key={n} value={n}>{n} Star{n !== 1 && "s"}</option>
            ))}
          </select>
        </div>
        <textarea
          placeholder="Write your review..."
          value={comment}
          onChange={e => setComment(e.target.value)}
          required
          className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 mb-2"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition-colors"
        >
          Submit Review
        </button>
      </form>
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((r, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
              <div className="flex items-center mb-1">
                <FaStar className="text-yellow-500 mr-1" />
                <span className="font-semibold">{r.rating} / 5</span>
                <span className="ml-2 text-gray-500 text-xs">{r.date}</span>
              </div>
              <div className="font-bold text-gray-800 dark:text-gray-100">{r.name}</div>
              <div className="text-gray-700 dark:text-gray-200">{r.comment}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
