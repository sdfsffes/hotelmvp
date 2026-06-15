// src/components/ReviewsSection.jsx
import { useState, useEffect } from "react";

export default function ReviewsSection({ serviceId, limit = 3 }) {
  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const allReviews = JSON.parse(localStorage.getItem("hotel_reviews") || "[]");
    const filtered = serviceId 
      ? allReviews.filter(r => r.serviceId === serviceId)
      : allReviews;
    setReviews(filtered.reverse());
  }, [serviceId]);

  const displayedReviews = showAll ? reviews : reviews.slice(0, limit);
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (reviews.length === 0) {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-xl text-center">
        <p className="text-gray-400 text-sm">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* Rating Summary */}
      <div className="flex items-center gap-3 mb-3 pb-3 border-b">
        <div className="flex items-center gap-1">
          <span className="text-2xl font-bold text-gray-800">{averageRating}</span>
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(star => (
              <span key={star} className={star <= Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}>
                ★
              </span>
            ))}
          </div>
        </div>
        <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {displayedReviews.map((review) => (
          <div key={review.id} className="border-b pb-3 last:border-0">
            <div className="flex justify-between items-start mb-1">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(star => (
                      <span key={star} className={star <= review.rating ? "text-yellow-400" : "text-gray-300"}>
                        ★
                      </span>
                    ))}
                  </div>
                  {review.verified && (
                    <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                      ✓ Verified Guest
                    </span>
                  )}
                </div>
                <p className="font-semibold text-gray-800 text-sm mt-1">{review.title}</p>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(review.date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-600 text-sm mt-1">{review.review}</p>
          </div>
        ))}
      </div>
      
      {reviews.length > limit && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 text-sm text-amber-600 hover:text-amber-700 font-semibold"
        >
          {showAll ? "Show less" : `See all ${reviews.length} reviews`}
        </button>
      )}
    </div>
  );
}