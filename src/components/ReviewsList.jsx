// src/components/ReviewsList.jsx
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

export default function ReviewsList({ serviceId, limit = 1 }) {
  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        let query = supabase
          .from('reviews')
          .select('*')
          .order('date', { ascending: false });

        if (serviceId) {
          query = query.eq('service_id', serviceId);
        }

        const { data, error } = await query;

        if (error) throw error;

        if (data && data.length > 0) {
          setReviews(data);
        } else {
          // Fallback: localStorage
          const allReviews = JSON.parse(localStorage.getItem("hotel_reviews") || "[]");
          const filtered = serviceId 
            ? allReviews.filter(r => r.serviceId === serviceId)
            : allReviews;
          setReviews(filtered.reverse());
        }
      } catch (error) {
        console.error('Error loading reviews:', error);
        const allReviews = JSON.parse(localStorage.getItem("hotel_reviews") || "[]");
        const filtered = serviceId 
          ? allReviews.filter(r => r.serviceId === serviceId)
          : allReviews;
        setReviews(filtered.reverse());
      }
    };

    loadReviews();
  }, [serviceId]);

  const displayedReviews = showAll ? reviews : reviews.slice(0, limit);
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (reviews.length === 0) {
    return (
      <div className="text-center py-2">
        <p className="text-gray-400 text-xs">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="mt-2 pt-2 border-t border-gray-100">
      {/* Rating Summary */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-gray-700">{averageRating}</span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
              <span key={star} className={`text-xs ${star <= Math.round(averageRating) ? "text-amber-400" : "text-gray-300"}`}>
                ★
              </span>
            ))}
          </div>
        </div>
        <span className="text-[10px] text-gray-400">({reviews.length})</span>
      </div>

      {/* Reviews List */}
      <div className="space-y-2">
        {displayedReviews.map((review) => (
          <div key={review.id} className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className={star <= review.rating ? "text-amber-400" : "text-gray-300"}>
                        ★
                      </span>
                    ))}
                  </div>
                  {review.verified && (
                    <span className="text-[8px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">✓</span>
                  )}
                </div>
                <p className="font-semibold text-gray-800 text-xs mt-0.5">{review.title}</p>
              </div>
              <span className="text-[8px] text-gray-400">
                {new Date(review.date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-500 text-[10px] mt-0.5 leading-relaxed line-clamp-2">{review.review}</p>
          </div>
        ))}
      </div>
      
      {/* Show All Button */}
      {reviews.length > limit && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-2 text-[10px] text-amber-600 hover:text-amber-700 font-medium transition-all duration-300 flex items-center gap-1"
        >
          {showAll ? "Show less ↑" : `See all ${reviews.length} reviews →`}
        </button>
      )}
    </div>
  );
}