// src/components/SuccessScreen.jsx
import { useState, useEffect } from "react";
import ReviewForm from "./ReviewForm";

export default function SuccessScreen({ request, onClose }) {
  const [countdown, setCountdown] = useState(10);
  const [copied, setCopied] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

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

  // Эффект конфетти
  useEffect(() => {
    const colors = ['#d97706', '#ea580c', '#f59e0b', '#fbbf24'];
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}%;
        top: -10px;
        width: ${Math.random() * 8 + 4}px;
        height: ${Math.random() * 8 + 4}px;
        background-color: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 2px;
        z-index: 9999;
        animation: confettiFall ${Math.random() * 2 + 2}s linear forwards;
        pointer-events: none;
      `;
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 3000);
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
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-5xl">✓</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Reservation Confirmed</h2>
          <p className="text-gray-500 text-sm mb-4">Thank you for choosing Movenpick</p>
          
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl my-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Booking Reference</p>
            <p className="text-xl font-bold text-amber-700 font-mono tracking-wider">{request.bookingCode}</p>
            <div className="flex justify-center gap-2 mt-2">
              <button
                onClick={() => handleCopyCode(request.bookingCode)}
                className="text-xs text-amber-600 hover:text-amber-700"
              >
                {copied ? "Copied!" : "Copy code"}
              </button>
            </div>
            <p className="text-sm mt-2 text-gray-600">Room: {request.customer.roomNumber}</p>
          </div>

          <div className="text-left space-y-2 mb-4 text-sm bg-gray-50 p-3 rounded-xl">
            <p><strong>Service:</strong> {request.service.title}</p>
            <p><strong>Date:</strong> {new Date(request.booking.date).toLocaleDateString()}</p>
            <p><strong>Guest:</strong> {request.customer.name}</p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-800 text-white py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Back to Experiences
          </button>

          {!reviewSubmitted && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="w-full mt-3 border border-amber-600 text-amber-600 py-2.5 rounded-xl font-semibold hover:bg-amber-50 transition-all"
            >
              ⭐ Leave a Review
            </button>
          )}
          
          {reviewSubmitted && (
            <div className="mt-3 p-3 bg-green-100 text-green-700 rounded-xl text-sm">
              ✅ Thank you for your review!
            </div>
          )}

          <div className="text-center text-xs text-gray-400 mt-4">
            Closing automatically in {countdown} seconds...
          </div>
        </div>
      </div>

      {showReviewForm && (
        <ReviewForm
          service={request.service}
          bookingCode={request.bookingCode}
          onClose={() => setShowReviewForm(false)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </>
  );
}