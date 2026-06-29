// src/components/ReviewForm.jsx
import { useState } from "react";

export default function ReviewForm({ service, bookingCode, onClose, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const reviewData = {
      id: Date.now(),
      bookingCode: bookingCode,
      serviceId: service.id,
      serviceTitle: service.title,
      serviceIcon: service.icon,
      rating: rating,
      title: title.trim() || "Great experience!",
      review: review.trim(),
      date: new Date().toISOString(),
      verified: true
    };
    
    const existing = JSON.parse(localStorage.getItem("hotel_reviews") || "[]");
    existing.push(reviewData);
    localStorage.setItem("hotel_reviews", JSON.stringify(existing));
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    onSubmit(reviewData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[60] p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-100/30 animate-scaleUp">
        <div className="sticky top-0 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-5 flex justify-between items-center border-b border-amber-200/50 rounded-t-3xl">
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-800">⭐ Leave a Review</h2>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
              <span className="text-2xl">{service.icon}</span>
              <span>{service.title}</span>
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-white transition-all">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 rounded-2xl p-4 border border-amber-200/30">
            <p className="text-sm text-gray-500">Booking: <span className="font-mono text-amber-600">{bookingCode}</span></p>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating *</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-4xl focus:outline-none transition-all duration-200 hover:scale-110"
                >
                  <span className={(hoverRating || rating) >= star ? "text-yellow-400 drop-shadow-lg" : "text-gray-300"}>
                    ★
                  </span>
                </button>
              ))}
              <span className="ml-2 text-sm font-semibold text-gray-500">
                {rating === 5 && "🌟 Excellent!"}
                {rating === 4 && "👏 Very Good"}
                {rating === 3 && "👍 Good"}
                {rating === 2 && "😐 Fair"}
                {rating === 1 && "😕 Poor"}
              </span>
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Review Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Amazing experience!"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white hover:border-amber-300"
            />
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Review *</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
              rows="4"
              placeholder="Share your experience with this service..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white hover:border-amber-300 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3.5 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>⭐</span>
                <span>Submit Review</span>
                <span>→</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}