// src/App.jsx
import { useState, useEffect } from "react";
import Header from "./components/Header";
import AdminPanel from "./components/AdminPanel";
import ServiceCard from "./components/ServiceCard";
import RequestForm from "./components/RequestForm";
import SuccessScreen from "./components/SuccessScreen";
import ReviewsList from "./components/ReviewsList";
import { services } from "./data/services";

// Фоновые изображения для секций
const backgroundImages = {
  hero: "url(https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&h=1080&fit=crop)",
  experience: "url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=600&fit=crop)",
  dining: "url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=600&fit=crop)",
  rooms: "url(https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1920&h=600&fit=crop)",
  wedding: "url(https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=600&fit=crop)"
};

// Данные для премиум-блоков
const restaurants = [
  {
    id: 1,
    name: "T55 New York Grill Room",
    description: "Premium dry-aged steaks and signature Tomahawk cuts, New York–inspired style and seaside sophistication.",
    image: "linear-gradient(135deg, #c9a84c 0%, #f5e6b8 100%)"
  },
  {
    id: 2,
    name: "La Costa Poolside",
    description: "Casual poolside dining with light bites, pizzas, and refreshing drinks paired with sea breezes.",
    image: "linear-gradient(135deg, #7ab7b0 0%, #b5d8d4 100%)"
  },
  {
    id: 3,
    name: "Red Coral Lounge",
    description: "Stylish lobby lounge with aromatic coffees, crafted cocktails, and chic evening ambiance.",
    image: "linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)"
  }
];

const rooms = [
  {
    id: 1,
    name: "Sea View Deluxe",
    description: "Private balcony with stunning ocean views, spacious bathtub for relaxing soaks.",
    image: "linear-gradient(135deg, #4a90d9 0%, #8bb9e8 100%)"
  },
  {
    id: 2,
    name: "Family Suite",
    description: "Connecting rooms for shared moments, perfect for family holidays by the sea.",
    image: "linear-gradient(135deg, #e8a87c 0%, #f5d4b8 100%)"
  },
  {
    id: 3,
    name: "Panorama Club Room",
    description: "Exclusive access to Panorama Club Lounge with sweeping ocean views.",
    image: "linear-gradient(135deg, #2c3e50 0%, #5d7a9a 100%)"
  }
];

const categories = [
  { id: "all", name: "All Services", icon: "🏠" },
  { id: "Dining", name: "Dining", icon: "🍽️" },
  { id: "Wellness", name: "Wellness", icon: "💆" },
  { id: "Adventure", name: "Adventure", icon: "⛵" },
  { id: "Activities", name: "Activities", icon: "🎨" },
  { id: "Family", name: "Family", icon: "👨‍👩‍👧" }
];

export default function App() {
  const [selectedService, setSelectedService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successRequest, setSuccessRequest] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [allReviews, setAllReviews] = useState([]);

  // Загрузка всех отзывов
  useEffect(() => {
    const reviews = JSON.parse(localStorage.getItem("hotel_reviews") || "[]");
    setAllReviews(reviews);
  }, []);

  const filteredServices = activeCategory === "all" 
    ? services 
    : services.filter(service => service.category === activeCategory);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setTimeout(() => {
      const section = document.getElementById('services-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleBookNow = (service) => {
    setSelectedService(service);
    setShowForm(true);
  };

  const handleSuccess = (request) => {
    setShowForm(false);
    setSuccessRequest(request);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedService(null);
  };

  const handleCloseSuccess = () => {
    setSuccessRequest(null);
    setSelectedService(null);
    const reviews = JSON.parse(localStorage.getItem("hotel_reviews") || "[]");
    setAllReviews(reviews);
  };

  return (
    <div className="min-h-screen bg-[#f8f6f2]">
      <Header 
        onAdminClick={() => setShowAdminPanel(true)} 
        onCategoryClick={handleCategoryClick}
      />
      
      {/* Hero Section - с фоновым изображением */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-cover bg-center" style={{ backgroundImage: backgroundImages.hero }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
        <div className="relative container mx-auto px-4 z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-amber-300 text-sm tracking-widest mb-4">
              <span>✦</span>
              <span>MÖVENPICK SIAM HOTEL</span>
              <span>✦</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-6">
              Family Paradise <br />in Pattaya
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-xl">
              Welcome to Na Jomtien Beach, home of Mövenpick Siam Hotel. A beachfront resort featuring sea view rooms, a lagoon pool, spa, and warm Swiss hospitality.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => {
                  document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="bg-gradient-to-r from-amber-500 to-amber-700 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-600 hover:to-amber-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Explore Experiences
              </button>
              <button 
                onClick={() => {
                  document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="border-2 border-white/50 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                View Services
              </button>
            </div>
            <div className="mt-12 flex flex-wrap gap-8 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-amber-400">✦</span>
                <span>262 Elegant Rooms</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400">✦</span>
                <span>2hrs from Bangkok</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400">✦</span>
                <span>★ 4.8 Guest Rating</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Experience Section - с фоновым изображением */}
      <section className="relative py-20 overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: backgroundImages.experience }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container mx-auto px-4 z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-amber-100/30">
              <span className="text-amber-600 font-semibold tracking-widest text-sm">EXPERIENCE</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 mb-4 text-gray-800">
                Your Family Escape by the Sea
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Nestled in one of Pattaya's most peaceful coastal areas, this beachfront resort features sea view rooms, 
                a lagoon pool, spa, and warm Swiss hospitality. Just 2 hours from Bangkok, it's a perfect escape for your next seaside retreat.
              </p>
              <div className="flex gap-8">
                <div>
                  <span className="text-3xl font-bold text-amber-600">262</span>
                  <p className="text-sm text-gray-500">Elegant Rooms</p>
                </div>
                <div>
                  <span className="text-3xl font-bold text-amber-600">2hrs</span>
                  <p className="text-sm text-gray-500">From Bangkok</p>
                </div>
                <div>
                  <span className="text-3xl font-bold text-amber-600">★ 4.8</span>
                  <p className="text-sm text-gray-500">Guest Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurants & Bars - с фоновым изображением */}
      <section className="relative py-20 overflow-hidden bg-cover bg-center" style={{ backgroundImage: backgroundImages.dining }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 z-10">
          <div className="text-center mb-12">
            <span className="text-amber-400 font-semibold tracking-widest text-sm">DINING</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 text-white">Restaurants & Bars</h2>
            <p className="text-white/80 max-w-2xl mx-auto mt-2">Discover where the best restaurants gather to provide a rich and flavorful dining journey</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {restaurants.map((item) => (
              <div key={item.id} className="bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
                <div className="relative h-56 overflow-hidden" style={{ background: item.image }}>
                  <div className="absolute inset-0 flex items-center justify-center text-6xl">
                    {item.id === 1 && "🥩"}
                    {item.id === 2 && "🍕"}
                    {item.id === 3 && "🍸"}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                  <button className="mt-4 text-amber-600 font-semibold hover:text-amber-700 transition flex items-center gap-1">
                    Learn more <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms & Suites - с фоновым изображением */}
      <section className="relative py-20 overflow-hidden bg-cover bg-center" style={{ backgroundImage: backgroundImages.rooms }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container mx-auto px-4 z-10">
          <div className="text-center mb-12">
            <span className="text-amber-400 font-semibold tracking-widest text-sm">ACCOMMODATION</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 text-white">Rooms & Suites</h2>
            <p className="text-white/80 max-w-2xl mx-auto mt-2">Find your perfect accommodation in Pattaya with stunning sea views from private balconies</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div key={room.id} className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-full h-72 flex items-center justify-center text-8xl" style={{ background: room.image }}>
                  {room.id === 1 && "🛏️"}
                  {room.id === 2 && "👨‍👩‍👧"}
                  {room.id === 3 && "🌟"}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 p-6 text-white">
                  <h3 className="text-2xl font-bold">{room.name}</h3>
                  <p className="text-sm opacity-90 mt-1">{room.description}</p>
                  <button className="mt-3 px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full text-sm font-semibold hover:from-amber-600 hover:to-amber-800 transition shadow-lg">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - без фона */}
      <section className="py-20 bg-[#f5f0e8]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800">Why Choose Movenpick</h2>
            <p className="text-gray-500 max-w-2xl mx-auto mt-2">Life tastes better at Movenpick Pattaya</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-amber-100/30">
              <div className="text-5xl mb-4">🌅</div>
              <h3 className="font-bold text-lg text-gray-800">Panoramic Views</h3>
              <p className="text-gray-500 text-sm mt-2">Every room offers stunning sea views from private balconies</p>
            </div>
            <div className="text-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-amber-100/30">
              <div className="text-5xl mb-4">🏖️</div>
              <h3 className="font-bold text-lg text-gray-800">Pristine Beachfront</h3>
              <p className="text-gray-500 text-sm mt-2">Step directly onto the quiet sands of Na Jomtien Beach</p>
            </div>
            <div className="text-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-amber-100/30">
              <div className="text-5xl mb-4">🍫</div>
              <h3 className="font-bold text-lg text-gray-800">Free Chocolate Hour</h3>
              <p className="text-gray-500 text-sm mt-2">60 minutes of daily bliss — joy served daily</p>
            </div>
            <div className="text-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-amber-100/30">
              <div className="text-5xl mb-4">👨‍👩‍👧</div>
              <h3 className="font-bold text-lg text-gray-800">Family First</h3>
              <p className="text-gray-500 text-sm mt-2">Activities for all ages with our Little Bird Kid's Club</p>
            </div>
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-amber-600 font-semibold tracking-widest text-sm">OFFERS</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 text-gray-800">Double the Joy</h2>
            <p className="text-gray-500 max-w-2xl mx-auto mt-2">Save up to 25% on your next coastal escape</p>
          </div>
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-2xl p-8 md:p-12 shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <span className="text-6xl font-bold">25% OFF</span>
                <p className="text-2xl font-serif mt-2">Stay in the Moment</p>
                <p className="opacity-90 text-sm mt-1">Valid for stays until 30 September 2026</p>
                <div className="flex gap-4 mt-3 text-sm">
                  <span className="bg-white/20 px-3 py-1 rounded-full">🌅 Sea View Rooms</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full">🍫 Chocolate Hour</span>
                </div>
              </div>
              <button className="px-8 py-3 bg-white text-amber-700 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg transform hover:scale-105">
                Book Now →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Section - с фоновым изображением */}
      <section className="relative py-20 overflow-hidden bg-cover bg-center" style={{ backgroundImage: backgroundImages.wedding }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-rose-100/30">
              <span className="text-amber-600 font-semibold tracking-widest text-sm">WEDDING</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 mb-4 text-gray-800">
                The Perfect Backdrop for Your "I Do"
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Imagine exchanging vows as the sun dips below the horizon, painting the sky in hues of gold and amber. 
                Our spacious, pristine beachfront lawn offers a romantic sanctuary for your special day.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-2xl">🤵</span>
                  <span>Versatile Event Spaces — up to 300 guests</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-2xl">🌅</span>
                  <span>Romantic Ambience with stunning sea views</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-2xl">👰</span>
                  <span>Professional Wedding Planner included</span>
                </div>
              </div>
              <button className="mt-8 px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-full font-semibold hover:from-amber-700 hover:to-amber-900 transition shadow-lg">
                Plan Your Wedding →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 shadow-md ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-amber-600 to-amber-800 text-white scale-105 shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-amber-100/30"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              {activeCategory === cat.id && <span className="text-sm">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div id="services-section" className="container mx-auto px-4 py-8 scroll-mt-20">
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm bg-white/80 inline-block px-4 py-2 rounded-full shadow-sm border border-amber-100/30">
            ✨ {filteredServices.length} luxury experiences available ✨
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
            {filteredServices.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100/30">
                <ServiceCard
                  service={service}
                  onBookNow={handleBookNow}
                />
                <div className="px-5 pb-5">
                  <ReviewsList serviceId={service.id} limit={2} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#1a2a3a] text-white/80 py-12 mt-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-serif font-bold text-white">Movenpick</h3>
              <p className="text-sm mt-2 text-white/60">Siam Hotel Na Jomtien Pattaya</p>
              <p className="text-sm text-white/40">Just 90 minutes from Bangkok</p>
              <div className="flex gap-4 mt-4">
                <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">📱</span>
                <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">📷</span>
                <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">🐦</span>
                <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">📘</span>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-amber-400 transition">Rooms & Suites</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Restaurants</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Weddings</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Offers</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Facilities</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">📍 Na Jomtien Beach, Pattaya</li>
                <li className="flex items-center gap-2">📞 +66 (0) 1234 5678</li>
                <li className="flex items-center gap-2">✉️ info@movenpickpattaya.com</li>
                <li className="flex items-center gap-2">🕐 24/7 Guest Service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Newsletter</h4>
              <p className="text-sm text-white/60">Subscribe for exclusive offers</p>
              <div className="flex mt-3">
                <input type="email" placeholder="Your email" className="px-4 py-2 rounded-l-full text-gray-800 w-full focus:outline-none" />
                <button className="px-4 py-2 bg-amber-600 rounded-r-full hover:bg-amber-700 transition">→</button>
              </div>
              <p className="text-xs text-white/40 mt-2">Get 10% off your first stay</p>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/40">
            <p>© 2024 Movenpick Siam Hotel Na Jomtien Pattaya. All rights reserved.</p>
            <p className="mt-1">Crafted with excellence for unforgettable moments</p>
          </div>
        </div>
      </footer>

      {/* Floating Admin Button */}
      <button
        onClick={() => setShowAdminPanel(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-amber-600 to-amber-800 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300"
        title="Admin Panel"
      >
        🛡️
      </button>

      {/* Modals */}
      {showForm && selectedService && (
        <RequestForm
          service={selectedService}
          onClose={handleCloseForm}
          onSuccess={handleSuccess}
        />
      )}

      {successRequest && (
        <SuccessScreen
          request={successRequest}
          onClose={handleCloseSuccess}
        />
      )}

      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}
    </div>
  );
}