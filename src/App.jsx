// src/App.jsx
import { useState, useEffect } from "react";
import Header from "./components/Header";
import AdminPanel from "./components/AdminPanel";
import ServiceCard from "./components/ServiceCard";
import { services } from "./data/services";

const categories = [
  { id: "all", name: "All Services", icon: "🏠", color: "bg-gray-500" },
  { id: "Dining", name: "Dining", icon: "🍽️", color: "bg-orange-500" },
  { id: "Wellness", name: "Wellness & Spa", icon: "💆", color: "bg-emerald-500" },
  { id: "Adventure", name: "Adventure", icon: "⛵", color: "bg-blue-500" },
  { id: "Activities", name: "Activities", icon: "🎨", color: "bg-purple-500" },
  { id: "Family", name: "Family", icon: "👨‍👩‍👧", color: "bg-pink-500" }
];

// Добавляем CSS анимации
const animationsStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scaleUp {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes slideUp {
    from { transform: translateY(50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  @keyframes pulse-slow {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes confettiFall {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
  }
  .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
  .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
  .animate-scaleUp { animation: scaleUp 0.3s ease-out forwards; }
  .animate-slideUp { animation: slideUp 0.3s ease-out forwards; }
  .animate-float { animation: float 4s ease-in-out infinite; }
  .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
  .animate-bounce { animation: bounce 0.5s ease-in-out; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-400 { animation-delay: 0.4s; }
  .font-serif { font-family: 'Playfair Display', Georgia, serif; }
`;

function RequestForm({ service, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", roomNumber: "", date: "", guests: "2", message: ""
  });
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);

  const handleGenerateCode = (e) => {
    e.preventDefault();
    const random = Math.floor(Math.random() * 10000);
    setCode(`${service.code}-${random}`);
    setStep(2);
  };

  const handleConfirm = () => {
    const request = {
      requestId: Date.now().toString(),
      bookingCode: code,
      roomNumber: formData.roomNumber,
      service: { id: service.id, code: service.code, title: service.title, icon: service.icon, price: service.price },
      customer: { name: formData.name, email: formData.email, phone: formData.phone },
      booking: { date: formData.date, guests: parseInt(formData.guests), message: formData.message },
      status: "pending",
      createdAt: new Date().toISOString()
    };
    const existing = JSON.parse(localStorage.getItem("hotel_requests") || "[]");
    existing.push(request);
    localStorage.setItem("hotel_requests", JSON.stringify(existing));
    onSuccess(request);
  };

  if (step === 2) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
        <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center" style={{ animation: 'scaleUp 0.3s ease-out' }}>
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4" style={{ animation: 'bounce 0.5s ease-in-out' }}>
            <span className="text-4xl">🎫</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Your Booking Code</h2>
          <p className="text-gray-500 text-sm mb-4">Please save this code for your records</p>
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl mb-4">
            <p className="text-2xl font-bold text-amber-600 font-mono">{code}</p>
          </div>
          <button onClick={handleConfirm} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-xl mb-2 hover:from-green-600 hover:to-emerald-700 transition-all hover:scale-105">Confirm Booking</button>
          <button onClick={onClose} className="w-full bg-gray-100 text-gray-600 py-2 rounded-xl hover:bg-gray-200 transition-all">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" style={{ animation: 'slideUp 0.3s ease-out' }}>
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Complete Your Booking</h2>
            <p className="text-sm text-gray-500">{service.title}</p>
          </div>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-gray-600 transition-transform hover:rotate-90">✕</button>
        </div>
        <form onSubmit={handleGenerateCode} className="p-6 space-y-4">
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-4 flex items-center gap-3">
            <span className="text-4xl">{service.icon}</span>
            <div>
              <p className="font-semibold text-gray-800">{service.title}</p>
              <p className="text-sm text-amber-600">฿{service.price} {service.priceUnit}</p>
            </div>
          </div>
          <input type="text" placeholder="Full Name *" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all focus:scale-[1.02]" onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input type="email" placeholder="Email *" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all focus:scale-[1.02]" onChange={e => setFormData({...formData, email: e.target.value})} required />
          <input type="tel" placeholder="Phone Number *" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all focus:scale-[1.02]" onChange={e => setFormData({...formData, phone: e.target.value})} required />
          <input type="text" placeholder="Room Number *" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all focus:scale-[1.02]" onChange={e => setFormData({...formData, roomNumber: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <input type="date" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" onChange={e => setFormData({...formData, date: e.target.value})} required />
            <select className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" onChange={e => setFormData({...formData, guests: e.target.value})}>
              {[1,2,3,4,5,6,7,8,9,10].map(num => <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>)}
            </select>
          </div>
          <textarea rows="2" placeholder="Special Requests (dietary restrictions, allergies, special occasions...)" className="w-full p-3 border rounded-xl resize-none focus:ring-2 focus:ring-amber-500 outline-none transition-all focus:scale-[1.02]" onChange={e => setFormData({...formData, message: e.target.value})} />
          <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 hover:scale-[1.02] shadow-md">Generate Reservation Code →</button>
        </form>
      </div>
    </div>
  );
}

function SuccessScreen({ request, onClose }) {
  useEffect(() => {
    const colors = ['#d97706', '#ea580c', '#f59e0b', '#fbbf24', '#10b981', '#3b82f6'];
    for (let i = 0; i < 80; i++) {
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center" style={{ animation: 'scaleUp 0.3s ease-out' }}>
        <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4" style={{ animation: 'bounce 0.5s ease-in-out' }}>
          <span className="text-5xl">✓</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Booking Confirmed! 🎉</h2>
        <p className="text-gray-500 text-sm mb-4">Thank you for choosing Movenpick</p>
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Booking Reference</p>
          <p className="text-xl font-bold text-amber-600 font-mono">{request.bookingCode}</p>
          <p className="text-sm mt-2 text-gray-600">Room: {request.roomNumber}</p>
          <p className="text-sm text-gray-600">Guest: {request.customer.name}</p>
        </div>
        <button onClick={onClose} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all hover:scale-105">Back to Experiences</button>
      </div>
    </div>
  );
}

export default function App() {
  const [selectedService, setSelectedService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successRequest, setSuccessRequest] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = animationsStyles;
    document.head.appendChild(style);
    
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);

  const filteredServices = activeCategory === "all" 
    ? services 
    : services.filter(service => service.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50/30">
      <Header onAdminClick={() => setShowAdminPanel(true)} />
      
      {/* Hero Section - улучшенная видимость текста */}
      <section className="relative bg-gradient-to-r from-amber-900 to-amber-800 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-7xl animate-float">✦</div>
          <div className="absolute bottom-10 right-10 text-7xl animate-float" style={{ animationDelay: '1s' }}>✦</div>
          <div className="absolute top-1/2 left-1/4 text-6xl animate-pulse-slow">★</div>
        </div>
        <div className="relative container mx-auto px-4 text-center z-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 drop-shadow-lg text-white animate-fadeInUp">
            Experiences That Define Luxury
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-white/95 drop-shadow animate-fadeInUp delay-200">
            From gourmet dining to relaxing spa treatments, discover the best of Movenpick
          </p>
          <div className="mt-8 flex justify-center gap-4 animate-fadeInUp delay-400">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 text-sm">🏆 Award Winning</div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 text-sm">⭐ 5 Star Luxury</div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 text-sm">✨ Swiss Hospitality</div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <div className="container mx-auto px-4 py-8 animate-on-scroll">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 shadow-md hover:scale-105 ${
                activeCategory === cat.id
                  ? `${cat.color} text-white scale-105 shadow-lg ring-2 ring-white/50`
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              <span className="text-lg">{cat.icon}</span>
              <span>{cat.name}</span>
              {activeCategory === cat.id && <span className="text-sm animate-pulse-slow">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-on-scroll">
          <p className="text-gray-500 text-sm bg-white/80 backdrop-blur-sm inline-block px-4 py-2 rounded-full shadow-sm">
            ✨ {filteredServices.length} luxury experiences available ✨
          </p>
        </div>

        {filteredServices.length === 0 ? (
          <div className="text-center py-16" style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div className="text-6xl mb-4 animate-bounce">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No services found</h3>
            <p className="text-gray-500">Try selecting a different category</p>
            <button
              onClick={() => setActiveCategory("all")}
              className="mt-4 text-amber-600 hover:text-amber-700 font-semibold transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              Clear filters → 
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, idx) => (
              <div 
                key={service.id} 
                className="animate-on-scroll"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <ServiceCard
                  service={service}
                  onBookNow={(s) => {
                    setSelectedService(s);
                    setShowForm(true);
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-gray-400 py-8 mt-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center group cursor-pointer">
              <div className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-110">🏨</div>
              <p className="text-xs uppercase tracking-wide">Luxury Hotel</p>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-110">⭐</div>
              <p className="text-xs uppercase tracking-wide">5 Star Service</p>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-110">🌍</div>
              <p className="text-xs uppercase tracking-wide">Worldwide</p>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-110">💎</div>
              <p className="text-xs uppercase tracking-wide">Premium</p>
            </div>
          </div>
          <p>© 2024 Movenpick Hotel & Resort. All rights reserved.</p>
          <p className="text-sm mt-2">Crafted with excellence for unforgettable moments</p>
        </div>
      </footer>

      {/* Floating Admin Button */}
      <button
        onClick={() => setShowAdminPanel(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-amber-600 to-amber-800 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse-slow"
        title="Admin Panel"
      >
        🛡️
      </button>

      {/* Modals */}
      {showForm && selectedService && (
        <RequestForm service={selectedService} onClose={() => setShowForm(false)} onSuccess={(req) => {
          setShowForm(false);
          setSuccessRequest(req);
        }} />
      )}

      {successRequest && (
        <SuccessScreen request={successRequest} onClose={() => setSuccessRequest(null)} />
      )}

      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}
    </div>
  );
}