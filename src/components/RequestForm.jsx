// src/components/RequestForm.jsx
import { useState } from "react";
import { supabase } from "../utils/supabase";

export default function RequestForm({ service, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    roomNumber: "",
    date: "",
    guests: "2",
    message: ""
  });
  const [generatedCode, setGeneratedCode] = useState("");
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.roomNumber) newErrors.roomNumber = "Room number is required";
    if (!formData.date) newErrors.date = "Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateCode = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      const date = new Date();
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const code = `${service.code}-${day}${month}-${random}`;
      
      setGeneratedCode(code);
      setStep(2);
      setIsSubmitting(false);
    }, 800);
  };

  const handleConfirm = async () => {
    const requestData = {
      request_id: Date.now().toString(),
      booking_code: generatedCode,
      verification_code: Math.floor(100000 + Math.random() * 900000).toString(),
      room_number: formData.roomNumber,
      service_id: service.id,
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      booking_date: formData.date,
      guests: parseInt(formData.guests),
      message: formData.message,
      total_price: `${service.price} ${service.priceUnit}`,
      status: "pending"
    };

    try {
      // Сохраняем в Supabase
      const { data, error } = await supabase
        .from('requests')
        .insert([requestData])
        .select();

      if (error) {
        console.error('❌ Error saving to Supabase:', error);
        // Fallback: сохраняем в localStorage
        const existing = JSON.parse(localStorage.getItem("hotel_requests") || "[]");
        existing.push(requestData);
        localStorage.setItem("hotel_requests", JSON.stringify(existing));
        console.log('📦 Saved to localStorage (fallback)');
      } else {
        console.log('✅ Request saved to Supabase:', data);
      }

      onSuccess({
        ...requestData,
        service: service,
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        booking: {
          date: formData.date,
          guests: parseInt(formData.guests),
          message: formData.message
        }
      });
    } catch (error) {
      console.error('❌ Error:', error);
      // Fallback: сохраняем в localStorage
      const existing = JSON.parse(localStorage.getItem("hotel_requests") || "[]");
      existing.push(requestData);
      localStorage.setItem("hotel_requests", JSON.stringify(existing));
      onSuccess({
        ...requestData,
        service: service,
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        booking: {
          date: formData.date,
          guests: parseInt(formData.guests),
          message: formData.message
        }
      });
    }
  };

  if (step === 2) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl animate-scaleUp border border-amber-100/30">
          <div className="relative">
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
              <div className="w-28 h-28 bg-gradient-to-br from-amber-400 via-orange-400 to-amber-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce ring-4 ring-amber-200/50">
                <span className="text-4xl font-serif font-bold text-white">★</span>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">
              Your Reservation Code
            </h2>
            <p className="text-gray-500 text-sm mb-6">Please save this code for your records</p>
            
            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 p-6 rounded-2xl border-2 border-amber-200/50 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 text-6xl">✦</div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Booking Reference</p>
              <p className="text-3xl font-bold text-amber-600 font-mono tracking-wider">{generatedCode}</p>
              <div className="mt-3 flex items-center justify-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1 bg-white/50 px-3 py-1 rounded-full">📅 {new Date(formData.date).toLocaleDateString()}</span>
                <span className="flex items-center gap-1 bg-white/50 px-3 py-1 rounded-full">🚪 {formData.roomNumber}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleConfirm}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2 group"
              >
                <span className="group-hover:rotate-12 transition-transform">✓</span>
                <span>Confirm Reservation</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setGeneratedCode("");
                }}
                className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>←</span>
                <span>Back to Form</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-100/30 animate-slideUp">
        <div className="sticky top-0 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 px-6 py-5 flex justify-between items-center border-b border-amber-200/50 rounded-t-3xl">
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-800">Complete Your Booking</h2>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
              <span className="text-2xl">{service.icon}</span>
              <span className="font-medium">{service.title}</span>
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleGenerateCode} className="p-6 space-y-4">
          <div className="bg-gradient-to-br from-amber-50/80 via-orange-50/80 to-amber-100/80 rounded-2xl p-4 flex items-center gap-4 border border-amber-200/30 shadow-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
              {service.icon}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-lg">{service.title}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">⌚ {service.time}</span>
                <span className="flex items-center gap-1">📍 {service.location}</span>
              </div>
              <p className="text-xl font-bold text-amber-600 mt-1">฿{service.price} {service.priceUnit}</p>
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-300 bg-gray-50/50 focus:bg-white ${
                errors.name ? 'border-red-500 bg-red-50/50' : 'border-gray-200 hover:border-amber-300'
              }`}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="John Doe"
              required
            />
            {errors.name && <p className="text-red-500 text-xs mt-1 animate-shake">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-300 bg-gray-50/50 focus:bg-white ${
                errors.email ? 'border-red-500 bg-red-50/50' : 'border-gray-200 hover:border-amber-300'
              }`}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="john@example.com"
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 animate-shake">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-300 bg-gray-50/50 focus:bg-white ${
                  errors.phone ? 'border-red-500 bg-red-50/50' : 'border-gray-200 hover:border-amber-300'
                }`}
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+66 123 456 789"
                required
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1 animate-shake">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Room <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-300 bg-gray-50/50 focus:bg-white ${
                  errors.roomNumber ? 'border-red-500 bg-red-50/50' : 'border-gray-200 hover:border-amber-300'
                }`}
                value={formData.roomNumber}
                onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                placeholder="e.g., 1205"
                required
              />
              {errors.roomNumber && <p className="text-red-500 text-xs mt-1 animate-shake">{errors.roomNumber}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-300 bg-gray-50/50 focus:bg-white ${
                  errors.date ? 'border-red-500 bg-red-50/50' : 'border-gray-200 hover:border-amber-300'
                }`}
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
              {errors.date && <p className="text-red-500 text-xs mt-1 animate-shake">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Guests
              </label>
              <select
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-300 bg-gray-50/50 focus:bg-white hover:border-amber-300"
                value={formData.guests}
                onChange={(e) => setFormData({...formData, guests: e.target.value})}
              >
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Special Requests
            </label>
            <textarea
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-300 bg-gray-50/50 focus:bg-white hover:border-amber-300"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="Dietary restrictions, allergies, special occasions..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white py-4 rounded-xl font-semibold hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating Code...</span>
              </>
            ) : (
              <>
                <span className="group-hover:rotate-12 transition-transform">✦</span>
                <span>Generate Reservation Code</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </>
            )}
          </button>

          <p className="text-xs text-center text-gray-400">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </form>
      </div>
    </div>
  );
}