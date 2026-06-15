// src/components/RequestForm.jsx
import { useState } from "react";

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
    
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const code = `${service.code}-${day}${month}-${random}`;
    
    setGeneratedCode(code);
    setStep(2);
  };

  // ЭТА ФУНКЦИЯ - ДОБАВИТЬ/ЗАМЕНИТЬ
  const handleConfirm = () => {
    const request = {
      requestId: Date.now().toString(),
      bookingCode: generatedCode,
      verificationCode: Math.floor(100000 + Math.random() * 900000).toString(),
      roomNumber: formData.roomNumber,
      service: {
        id: service.id,
        code: service.code,
        title: service.title,
        category: service.category,
        price: service.price,
        time: service.time,
        location: service.location,
        icon: service.icon
      },
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      },
      booking: {
        date: formData.date,
        guests: parseInt(formData.guests),
        message: formData.message,
        totalPrice: { formattedTotal: service.price }
      },
      status: "pending",
      createdAt: new Date().toISOString()
    };
    
    // Сохраняем в localStorage
    const existing = JSON.parse(localStorage.getItem("hotel_requests") || "[]");
    existing.push(request);
    localStorage.setItem("hotel_requests", JSON.stringify(existing));
    
    onSuccess(request);
  };

  if (step === 2) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
          <div className="text-5xl mb-4">🎫</div>
          <h2 className="text-2xl font-bold mb-2">Your Booking Code</h2>
          <div className="bg-amber-50 p-4 rounded-xl my-4">
            <p className="text-sm text-gray-500">Request Code</p>
            <p className="text-2xl font-bold text-amber-600 font-mono">{generatedCode}</p>
            <p className="text-sm mt-2">Room: {formData.roomNumber}</p>
          </div>
          <button
            onClick={handleConfirm}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-xl font-semibold mb-2"
          >
            Confirm Booking →
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-2 rounded-xl font-semibold"
          >
            Make another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Book Your Experience</h2>
            <p className="text-sm text-gray-500">{service.title}</p>
          </div>
          <button onClick={onClose} className="text-2xl">✕</button>
        </div>

        <form onSubmit={handleGenerateCode} className="p-6 space-y-4">
          <div className="bg-amber-50 rounded-xl p-4 flex items-center gap-3">
            <span className="text-3xl">{service.icon}</span>
            <div>
              <p className="font-semibold">{service.title}</p>
              <p className="text-sm text-amber-600">{service.price}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Full Name *</label>
            <input
              type="text"
              className={`w-full px-4 py-2 border rounded-xl ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Email *</label>
            <input
              type="email"
              className={`w-full px-4 py-2 border rounded-xl ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Phone Number *</label>
            <input
              type="tel"
              className={`w-full px-4 py-2 border rounded-xl ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="+66 123 456 789"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Room Number *</label>
            <input
              type="text"
              className={`w-full px-4 py-2 border rounded-xl ${errors.roomNumber ? 'border-red-500' : 'border-gray-300'}`}
              value={formData.roomNumber}
              onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
              placeholder="e.g., 1205"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Date *</label>
              <input
                type="date"
                className={`w-full px-4 py-2 border rounded-xl ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Guests</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-xl"
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
            <label className="block text-sm font-semibold mb-1">Special Requests</label>
            <textarea
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl resize-none"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="Any special requests?"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold"
          >
            Generate Request Code →
          </button>
        </form>
      </div>
    </div>
  );
}