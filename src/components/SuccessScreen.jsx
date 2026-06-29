// src/components/SuccessScreen.jsx
import { useState, useEffect } from "react";
import ReviewForm from "./ReviewForm";
import ReviewsList from "./ReviewsList";

export default function SuccessScreen({ request, onClose }) {
  const [countdown, setCountdown] = useState(10);
  const [copied, setCopied] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const colors = ['#d97706', '#ea580c', '#f59e0b', '#fbbf24', '#10b981', '#3b82f6'];
    for (let i = 0; i < 60; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}%;
        top: -10px;
        width: ${Math.random() * 10 + 4}px;
        height: ${Math.random() * 10 + 4}px;
        background-color: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 2px;
        z-index: 9999;
        pointer-events: none;
        animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
      `;
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 5000);
    }
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReviewSubmit = (review) => {
    setShowReviewForm(false);
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  if (!request) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl border border-amber-100/30 animate-scaleUp">
          {/* Success Icon */}
          <div className="relative">
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
              <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce ring-4 ring-green-200/50">
                <span className="text-5xl">✓</span>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">🎉 Reservation Confirmed!</h2>
            <p className="text-gray-500 text-sm mb-6">Thank you for choosing Movenpick</p>

            {/* Booking Code */}
            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 p-6 rounded-2xl border-2 border-amber-200/50 shadow-inner">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Booking Reference</p>
              <div className="flex items-center justify-center gap-3">
                <p className="text-2xl font-bold text-amber-600 font-mono tracking-wider">{request.bookingCode}</p>
                <button
                  onClick={() => handleCopyCode(request.bookingCode)}
                  className="p-2 bg-white rounded-lg hover:bg-gray-50 transition-all shadow-sm"
                  title="Copy code"
                >
                  {copied ? '✅' : '📋'}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">Verification: {request.verificationCode}</p>
            </div>

            {/* Details */}
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm bg-gray-50 p-4 rounded-2xl">
              <div className="text-left">
                <p className="text-gray-400 text-xs">Service</p>
                <p className="font-medium text-gray-800">{request.service.title}</p>
              </div>
              <div className="text-left">
                <p className="text-gray-400 text-xs">Date</p>
                <p className="font-medium text-gray-800">{new Date(request.booking.date).toLocaleDateString()}</p>
              </div>
              <div className="text-left">
                <p className="text-gray-400 text-xs">Room</p>
                <p className="font-medium text-gray-800">{request.customer.roomNumber}</p>
              </div>
              <div className="text-left">
                <p className="text-gray-400 text-xs">Guest</p>
                <p className="font-medium text-gray-800">{request.customer.name}</p>
              </div>
            </div>

            {/* Кнопки */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3.5 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2 group"
              >
                <span>🏠</span>
                <span>Back to Experiences</span>
              </button>
              
              {!reviewSubmitted && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="w-full border-2 border-amber-500/50 text-amber-600 py-3 rounded-xl font-semibold hover:bg-amber-50 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <span className="group-hover:scale-110 transition-transform">⭐</span>
                  <span>Leave a Review</span>
                </button>
              )}
              
              {reviewSubmitted && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm animate-fadeIn">
                  ✅ Thank you for your review!
                </div>
              )}

              <button
                onClick={() => setShowAllReviews(true)}
                className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>📖</span>
                <span>View All Reviews</span>
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              Closing automatically in {countdown} seconds...
            </p>
          </div>
        </div>
      </div>

      {/* Форма отзыва */}
      {showReviewForm && (
        <ReviewForm
          service={request.service}
          bookingCode={request.bookingCode}
          onClose={() => setShowReviewForm(false)}
          onSubmit={handleReviewSubmit}
        />
      )}

      {/* Все отзывы */}
      {showAllReviews && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-100/30 animate-scaleUp">
            <div className="sticky top-0 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-5 flex justify-between items-center border-b border-amber-200/50 rounded-t-3xl">
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-800">📖 All Reviews</h2>
                <p className="text-sm text-gray-500">What guests are saying</p>
              </div>
              <button 
                onClick={() => setShowAllReviews(false)}
                className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-white transition-all"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <ReviewsList serviceId={request.service.id} limit={10} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}