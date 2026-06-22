// src/App.jsx
import { useState, useEffect } from "react";
import Header from "./components/Header";
import AdminPanel from "./components/AdminPanel";
import ServiceCard from "./components/ServiceCard";
import { services } from "./data/services";

const categories = [
  { id: "all", name: "All Experiences", icon: "✦" },
  { id: "family", name: "Family Favourites", icon: "👨‍👩‍👧" },
  { id: "wellness", name: "Sweet Retreats", icon: "💆" },
  { id: "dining", name: "Gourmet Getaways", icon: "🍽️" },
  { id: "adventure", name: "Adventure", icon: "⛵" },
  { id: "activities", name: "Activities", icon: "🎨" }
];

// Премиальные спецпредложения
const offers = [
  {
    id: 1,
    title: "Stay in the Moment",
    description: "Experience mouth-watering culinary experiences, a slice of cosmopolitan culture with art, design and delicious views.",
    discount: "25% OFF",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=400&fit=crop"
  },
  {
    id: 2,
    title: "Stay and Save",
    description: "Enjoy amazing discounts and breakfast included during your stay at Movenpick Hotels & Resorts.",
    discount: "UP TO 30%",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=400&fit=crop"
  },
  {
    id: 3,
    title: "Indulgence is Back",
    description: "It's time to savour life again! Unveiling an array of indulgent dining experiences.",
    discount: "EXCLUSIVE",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop"
  }
];

const brandValues = [
  {
    icon: "🍷",
    title: "Food & Drink",
    description: "We've been making mouth-watering moments for more than 70 years, creating culinary experiences bursting with flavour.",
    link: "#"
  },
  {
    icon: "🤝",
    title: "Kilo of Kindness",
    description: "Small acts of generosity can change lives. Our annual charity initiative brings together hotels, guests, and communities.",
    link: "#"
  },
  {
    icon: "📖",
    title: "Serving the good life since 1948",
    description: "When people are hungry for new ways to enjoy life, we deliver. Discover the essence of Movenpick.",
    link: "#"
  },
  {
    icon: "🌍",
    title: "Nourishing the planet",
    description: "The greatest indulgence is giving back to create a brighter future. A refreshing approach to sustainability.",
    link: "#"
  }
];

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    review: "An unforgettable experience! The attention to detail and luxury service made our stay truly exceptional.",
    rating: 5,
    location: "Movenpick Phuket"
  },
  {
    id: 2,
    name: "Michael Chen",
    review: "The culinary experience was outstanding. Every meal was a journey of flavors and artistry.",
    rating: 5,
    location: "Movenpick Bangkok"
  },
  {
    id: 3,
    name: "Emma Wilson",
    review: "The spa and wellness retreat was exactly what we needed. Pure relaxation in a stunning setting.",
    rating: 5,
    location: "Movenpick Bali"
  }
];

// Компонент Request Form (без изменений)
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
          <textarea rows="2" placeholder="Special Requests" className="w-full p-3 border rounded-xl resize-none focus:ring-2 focus:ring-amber-500 outline-none transition-all focus:scale-[1.02]" onChange={e => setFormData({...formData, message: e.target.value})} />
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

// Компонент отзывов
function TestimonialsSection({ testimonials }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="py-16 bg-gradient-to-r from-amber-50 to-orange-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-gray-800 mb-3">Guest Experiences</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">What our guests are saying about their Movenpick experience</p>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="flex justify-center gap-1 text-amber-400 text-xl mb-4">
              {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
            <p className="text-lg italic text-gray-700 mb-6">"{testimonials[activeIndex].review}"</p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {testimonials[activeIndex].name.charAt(0)}
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">{testimonials[activeIndex].name}</p>
                <p className="text-sm text-gray-400">{testimonials[activeIndex].location}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-8 bg-amber-500' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [selectedService, setSelectedService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successRequest, setSuccessRequest] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  // Маппинг категорий для фильтрации
  const categoryMap = {
    'all': 'all',
    'family': 'Family',
    'wellness': 'Wellness',
    'dining': 'Dining',
    'adventure': 'Adventure',
    'activities': 'Activities'
  };

  const filteredServices = activeCategory === "all" 
    ? services 
    : services.filter(service => service.category === categoryMap[activeCategory]);

  return (
    <div className="min-h-screen bg-white">
      <Header onAdminClick={() => setShowAdminPanel(true)} />
      
      {/* Премиум Hero секция */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop" 
            alt="Luxury Hotel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        </div>
        <div className="relative container mx-auto px-4 z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-amber-400 text-sm tracking-widest mb-4">
              <span>✦</span>
              <span>MÖVENPICK HOTELS & RESORTS</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-6">
              Indulgence done right
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-xl">
              Taste the good life at Movenpick Hotels & Resorts, where every moment is designed to be savoured.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                Discover Experiences
              </button>
              <button className="border-2 border-white/50 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all backdrop-blur-sm">
                View Offers
              </button>
            </div>
            <div className="mt-12 flex gap-8 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-amber-400">✦</span>
                <span>Swiss Hospitality</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400">✦</span>
                <span>5-Star Luxury</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400">✦</span>
                <span>Since 1948</span>
              </div>
            </div>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Stays for all Tastes - Премиум категории */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-gray-800 mb-3">Stays for all Tastes</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">From family favourites to sweet retreats, find your perfect getaway</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop" alt="Family" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 p-6 text-white">
                <span className="text-3xl mb-2 block">👨‍👩‍👧</span>
                <h3 className="text-xl font-bold">Family Favourites</h3>
                <p className="text-sm opacity-90">Stays taste better together – our family holidays serve up a menu of delights to suit all tastebuds.</p>
              </div>
            </div>
            <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop" alt="Sweet Retreats" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 p-6 text-white">
                <span className="text-3xl mb-2 block">💆</span>
                <h3 className="text-xl font-bold">Sweet Retreats</h3>
                <p className="text-sm opacity-90">From luscious spas with velvety beds to cool pools designed for double dips, resort life is refreshing.</p>
              </div>
            </div>
            <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop" alt="Gourmet" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 p-6 text-white">
                <span className="text-3xl mb-2 block">🍽️</span>
                <h3 className="text-xl font-bold">Gourmet Getaways</h3>
                <p className="text-sm opacity-90">Dining destinations in abundance, serving food and wine that's just divine in our hotel bars and restaurants.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="py-20 bg-gradient-to-r from-amber-50 to-orange-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-gray-800 mb-3">Offers too good to resist</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Exclusive experiences and amazing value for your stay</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
                <div className="relative h-48 overflow-hidden">
                  <img src={offer.image} alt={offer.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {offer.discount}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{offer.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{offer.description}</p>
                  <button className="text-amber-600 font-semibold hover:text-amber-700 transition flex items-center gap-1 group">
                    Explore offer 
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-gray-800 mb-3">Life's natural pleasures celebrated</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">We savour life wholeheartedly, sprinkling goodness across all that we do.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {brandValues.map((value, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{value.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-500 text-sm">{value.description}</p>
                <button className="mt-4 text-amber-600 font-semibold hover:text-amber-700 transition text-sm flex items-center justify-center gap-1">
                  View more <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guest Experiences / Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* Quote Section */}
      <section className="py-16 bg-gradient-to-r from-amber-800 to-orange-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <blockquote className="max-w-3xl mx-auto">
            <p className="text-2xl md:text-3xl font-serif italic mb-4">"We aren't doing anything extraordinary. We are successful because we simply do ordinary things in an extraordinary way."</p>
            <footer className="text-amber-300 text-sm tracking-widest">— Ueli Prager, Founder</footer>
          </blockquote>
        </div>
      </section>

      {/* Categories - фильтр для услуг */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 shadow-md hover:scale-105 ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white scale-105 shadow-lg ring-2 ring-white/50"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm bg-white/80 backdrop-blur-sm inline-block px-4 py-2 rounded-full shadow-sm">
            ✨ {filteredServices.length} luxurious experiences available ✨
          </p>
        </div>

        {filteredServices.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No services found</h3>
            <p className="text-gray-500">Try selecting a different category</p>
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

      {/* Loyalty Program Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="text-5xl mb-4">✨</div>
            <h2 className="text-3xl font-serif font-bold mb-4">Indulge yourself with ALL</h2>
            <p className="text-gray-300 mb-6">Unexpected experiences, unique benefits and exclusive rewards. Open the doors of endless possibilities.</p>
            <button className="border-2 border-white/50 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all backdrop-blur-sm">
              Learn More →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a2e] text-gray-400 py-8">
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
          <p className="text-sm">© 2024 Movenpick Hotel & Resort. All rights reserved.</p>
          <p className="text-xs mt-2 text-gray-500">Crafted with excellence for unforgettable moments</p>
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