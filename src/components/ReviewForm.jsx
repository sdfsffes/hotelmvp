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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Write a Review</h2>
            <p className="text-sm text-gray-500">For: {service.title}</p>
          </div>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-3 flex items-center gap-3">
            <span className="text-3xl">{service.icon}</span>
            <div>
              <p className="font-semibold text-gray-800">{service.title}</p>
              <p className="text-xs text-gray-500">Booking: {bookingCode}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating *</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-3xl focus:outline-none transition-transform hover:scale-110"
                >
                  <span className={(hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300"}>
                    ★
                  </span>
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500">
                {rating === 5 && "Excellent!"}
                {rating === 4 && "Very Good"}
                {rating === 3 && "Good"}
                {rating === 2 && "Fair"}
                {rating === 1 && "Poor"}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Review Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Amazing experience!"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Your Review *</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
              rows="4"
              placeholder="Share your experience with this service..."
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-800 text-white py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-amber-900 transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Review →"}
          </button>
        </form>
      </div>
    </div>
  );
}