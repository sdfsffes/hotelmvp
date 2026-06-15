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

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <span>⭐</span> Guest Reviews ({reviews.length})
      </h3>
      
      <div className="space-y-3">
        {displayedReviews.map((review) => (
          <div key={review.id} className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(star => (
                      <span key={star} className={star <= review.rating ? "text-yellow-400" : "text-gray-300"}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="font-semibold text-gray-800">{review.customerName}</span>
                </div>
                <p className="font-medium text-gray-700 text-sm mt-1">{review.title}</p>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(review.date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-600 text-sm">{review.review}</p>
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