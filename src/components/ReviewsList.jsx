// src/components/ReviewsList.jsx
import { useState, useEffect } from "react";

export default function ReviewsList({ serviceId, limit = 3 }) {
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
      <div className="text-center py-4">
        <p className="text-gray-400 text-sm">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-700">{averageRating}</span>
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(star => (
              <span key={star} className={star <= Math.round(averageRating) ? "text-amber-400" : "text-gray-300"}>
                ★
              </span>
            ))}
          </div>
        </div>
        <span className="text-xs text-gray-400">({reviews.length} reviews)</span>
      </div>

      <div className="space-y-3">
        {displayedReviews.map((review) => (
          <div key={review.id} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-3 border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-1">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(star => (
                      <span key={star} className={star <= review.rating ? "text-amber-400" : "text-gray-300"}>
                        ★
                      </span>
                    ))}
                  </div>
                  {review.verified && (
                    <span className="text-[9px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-200/50">
                      Verified Guest
                    </span>
                  )}
                </div>
                <p className="font-semibold text-gray-800 text-sm mt-0.5">{review.title}</p>
              </div>
              <span className="text-[10px] text-gray-400">
                {new Date(review.date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-600 text-xs mt-1 leading-relaxed">{review.review}</p>
          </div>
        ))}
      </div>
      
      {reviews.length > limit && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-2 text-xs text-amber-600 hover:text-amber-700 font-medium transition-all duration-300 flex items-center gap-1"
        >
          {showAll ? "Show less ↑" : `See all ${reviews.length} reviews →`}
        </button>
      )}
    </div>
  );
}