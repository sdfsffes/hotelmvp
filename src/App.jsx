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
  hero: "url(https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?w=1920&h=1080&fit=crop)",
  experience: "url(https://images.pexels.com/photos/2609221/pexels-photo-2609221.jpeg?w=1920&h=600&fit=crop)",
  dining: "url(https://images.pexels.com/photos/2609221/pexels-photo-2609221.jpeg?w=1920&h=600&fit=crop)",
  rooms: "url(https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?w=1920&h=600&fit=crop)",
  wedding: "url(https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?w=1920&h=600&fit=crop)",
  whyChoose: "url(https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?w=1920&h=600&fit=crop)",
  offers: "url(https://images.pexels.com/photos/2609221/pexels-photo-2609221.jpeg?w=1920&h=600&fit=crop)",
  services: "url(https://images.pexels.com/photos/2609221/pexels-photo-2609221.jpeg?w=1920&h=600&fit=crop)",
  categories: "url(https://images.pexels.com/photos/2609221/pexels-photo-2609221.jpeg?w=1920&h=400&fit=crop)"
};

// Данные для ресторанов с фотографиями
const restaurants = [
  {
    id: 1,
    name: "T55 New York Grill Room",
    description: "Premium dry-aged steaks and signature Tomahawk cuts, New York–inspired style and seaside sophistication.",
    image: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?w=600&h=400&fit=crop"
  },
  {
    id: 2,
    name: "La Costa Poolside",
    description: "Casual poolside dining with light bites, pizzas, and refreshing drinks paired with sea breezes.",
    image: "https://images.pexels.com/photos/2609221/pexels-photo-2609221.jpeg?w=600&h=400&fit=crop"
  },
  {
    id: 3,
    name: "Red Coral Lounge",
    description: "Stylish lobby lounge with aromatic coffees, crafted cocktails, and chic evening ambiance.",
    image: "https://images.pexels.com/photos/2609221/pexels-photo-2609221.jpeg?w=600&h=400&fit=crop"
  }
];

// Данные для номеров с фотографиями
const rooms = [
  {
    id: 1,
    name: "Sea View Deluxe",
    description: "Private balcony with stunning ocean views, spacious bathtub for relaxing soaks.",
    image: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?w=600&h=400&fit=crop"
  },
  {
    id: 2,
    name: "Family Suite",
    description: "Connecting rooms for shared moments, perfect for family holidays by the sea.",
    image: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?w=600&h=400&fit=crop"
  },
  {
    id: 3,
    name: "Panorama Club Room",
    description: "Exclusive access to Panorama Club Lounge with sweeping ocean views.",
    image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?w=600&h=400&fit=crop"
  }
];

const categories = [
  { id: "all", name: "All Services", icon: "★" },
  { id: "Dining", name: "Dining", icon: "✧" },
  { id: "Wellness", name: "Wellness", icon: "✧" },
  { id: "Adventure", name: "Adventure", icon: "✧" },
  { id: "Activities", name: "Activities", icon: "✧" },
  { id: "Family", name: "Family", icon: "✧" }
];

export default function App() {
  const [selectedService, setSelectedService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successRequest, setSuccessRequest] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [allReviews, setAllReviews] = useState([]);

  useEffect(() => {
    const reviews = JSON.parse(localStorage.getItem("hotel_reviews") || "[]");
    setAllReviews(reviews);

    // Проверка URL на /admin - работает и на локальном и на Vercel
    const path = window.location.pathname;
    if (path === '/admin' || path === '/admin/' || path.startsWith('/admin')) {
      setShowAdminPanel(true);
    }
  }, []);

  // Слушаем изменения URL для /admin
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin' || path === '/admin/' || path.startsWith('/admin')) {
        setShowAdminPanel(true);
      } else {
        setShowAdminPanel(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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

  const handleAdminClose = () => {
    setShowAdminPanel(false);
    window.history.pushState({}, '', '/');
  };

  // Если открыта админ-панель, показываем только её
  if (showAdminPanel) {
    return <AdminPanel onClose={handleAdminClose} />;
  }

  return (
    <div className="min-h-screen bg-[#f8f6f2] font-sans">
      <Header onCategoryClick={handleCategoryClick} />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-cover bg-center" style={{ backgroundImage: backgroundImages.hero }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
        <div className="relative container mx-auto px-4 z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-amber-300 text-sm tracking-widest mb-4 font-sans">
              <span>✦</span>
              <span className="tracking-[0.3em]">MÖVENPICK SIAM HOTEL</span>
              <span>✦</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-6">
              Family Paradise <br />in Pattaya
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-xl font-sans font-light leading-relaxed">
              Welcome to Na Jomtien Beach, home of Mövenpick Siam Hotel. A beachfront resort featuring sea view rooms, a lagoon pool, spa, and warm Swiss hospitality.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => {
                  document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="bg-gradient-to-r from-amber-500 to-amber-700 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-600 hover:to-amber-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-sans tracking-wide"
              >
                Explore Experiences
              </button>
              <button 
                onClick={() => {
                  document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="border-2 border-white/50 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all backdrop-blur-sm font-sans tracking-wide"
              >
                View Services
              </button>
            </div>
            <div className="mt-12 flex flex-wrap gap-8 text-white/70 text-sm font-sans">
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

      {/* Experience Section */}
      <section className="relative py-20 overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: backgroundImages.experience }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container mx-auto px-4 z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-amber-100/30">
              <span className="text-amber-600 font-semibold tracking-widest text-sm font-sans">EXPERIENCE</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 mb-4 text-gray-800">
                Your Family Escape by the Sea
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed font-sans font-light">
                Nestled in one of Pattaya's most peaceful coastal areas, this beachfront resort features sea view rooms, 
                a lagoon pool, spa, and warm Swiss hospitality. Just 2 hours from Bangkok, it's a perfect escape for your next seaside retreat.
              </p>
              <div className="flex gap-8 font-sans">
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

      {/* Restaurants & Bars */}
      <section className="relative py-20 overflow-hidden bg-cover bg-center" style={{ backgroundImage: backgroundImages.dining }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 z-10">
          <div className="text-center mb-12">
            <span className="text-amber-400 font-semibold tracking-[0.2em] text-sm font-sans">DINING</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 text-white">Restaurants & Bars</h2>
            <p className="text-white/80 max-w-2xl mx-auto mt-2 font-sans font-light">Discover where the best restaurants gather to provide a rich and flavorful dining journey</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {restaurants.map((item) => (
              <div key={item.id} className="group bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-4">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-serif font-bold text-gray-800 mb-3 group-hover:text-amber-600 transition-colors">{item.name}</h3>
                  <p className="text-gray-500 leading-relaxed font-sans font-light">{item.description}</p>
                  <button className="mt-6 text-amber-600 font-semibold hover:text-amber-700 transition-all flex items-center gap-2 group-hover:gap-4 font-sans">
                    Learn more <span className="transition-transform">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms & Suites */}
      <section className="relative py-20 overflow-hidden bg-cover bg-center" style={{ backgroundImage: backgroundImages.rooms }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container mx-auto px-4 z-10">
          <div className="text-center mb-12">
            <span className="text-amber-400 font-semibold tracking-[0.2em] text-sm font-sans">ACCOMMODATION</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 text-white">Rooms & Suites</h2>
            <p className="text-white/80 max-w-2xl mx-auto mt-2 font-sans font-light">Find your perfect accommodation in Pattaya with stunning sea views from private balconies</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div key={room.id} className="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-4">
                <img 
                  src={room.image} 
                  alt={room.name} 
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 p-8 text-white">
                  <h3 className="text-2xl font-serif font-bold">{room.name}</h3>
                  <p className="text-sm opacity-80 mt-2 leading-relaxed font-sans font-light">{room.description}</p>
                  <button className="mt-4 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full text-sm font-semibold hover:from-amber-600 hover:to-amber-800 transition-all shadow-lg hover:shadow-amber-500/30 transform hover:scale-105 font-sans tracking-wide">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Movenpick */}
      <section className="relative py-20 overflow-hidden bg-cover bg-center" style={{ backgroundImage: backgroundImages.whyChoose }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container mx-auto px-4 z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">Why Choose Movenpick</h2>
            <p className="text-white/80 max-w-2xl mx-auto mt-2 font-sans font-light">Life tastes better at Movenpick Pattaya</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: "Panoramic Views", desc: "Every room offers stunning sea views from private balconies", img: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?w=600&h=400&fit=crop" },
              { title: "Pristine Beachfront", desc: "Step directly onto the quiet sands of Na Jomtien Beach", img: "https://images.pexels.com/photos/2609221/pexels-photo-2609221.jpeg?w=600&h=400&fit=crop" },
              { title: "Free Chocolate Hour", desc: "60 minutes of daily bliss — joy served daily", img: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?w=600&h=400&fit=crop" },
              { title: "Family First", desc: "Activities for all ages with our Little Bird Kids Club", img: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?w=600&h=400&fit=crop" }
            ].map((item, index) => (
              <div key={index} className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <img src={item.img} alt={item.title} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 p-6 text-white">
                  <h3 className="text-xl font-serif font-bold">{item.title}</h3>
                  <p className="text-sm opacity-80 mt-2 font-sans font-light">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="relative py-20 overflow-hidden bg-cover bg-center" style={{ backgroundImage: backgroundImages.offers }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 z-10">
          <div className="text-center mb-12">
            <span className="text-amber-400 font-semibold tracking-[0.2em] text-sm font-sans">OFFERS</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 text-white">Double the Joy</h2>
            <p className="text-white/80 max-w-2xl mx-auto mt-2 font-sans font-light">Save up to 25% on your next coastal escape</p>
          </div>
          <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-2xl border border-amber-100/30 transform hover:scale-[1.02] transition-all duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <div className="flex items-center gap-4">
                  <span className="text-7xl font-bold text-amber-600">25%</span>
                  <span className="text-3xl font-bold text-amber-600">OFF</span>
                </div>
                <p className="text-2xl font-serif mt-2 text-gray-800">Stay in the Moment</p>
                <p className="text-gray-500 text-sm mt-1 font-sans">Valid for stays until 30 September 2026</p>
                <div className="flex flex-wrap gap-3 mt-3">
                  <span className="bg-gradient-to-r from-amber-100/70 to-orange-100/70 px-3 py-1.5 rounded-full text-amber-700 text-xs font-medium border border-amber-200/50 font-sans">
                    Sea View Rooms
                  </span>
                  <span className="bg-gradient-to-r from-amber-100/70 to-orange-100/70 px-3 py-1.5 rounded-full text-amber-700 text-xs font-medium border border-amber-200/50 font-sans">
                    Chocolate Hour
                  </span>
                </div>
              </div>
              <button className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-700 text-white rounded-full font-semibold hover:from-amber-600 hover:to-amber-800 transition-all duration-500 shadow-lg hover:shadow-amber-500/30 transform hover:scale-105 font-sans tracking-wide">
                Book Now →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Section */}
      <section className="relative py-20 overflow-hidden bg-cover bg-center" style={{ backgroundImage: backgroundImages.wedding }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 z-10">
          <div className="text-center mb-12">
            <span className="text-amber-400 font-semibold tracking-[0.2em] text-sm font-sans">WEDDING</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 text-white">Plan Your Wedding</h2>
            <p className="text-white/80 max-w-2xl mx-auto mt-2 font-sans font-light">The Perfect Backdrop for Your "I Do"</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-rose-100/30 transform hover:-translate-y-2 transition-all duration-500">
              <h3 className="text-2xl font-serif font-bold text-gray-800 mb-6">Why Choose Movenpick for Your Wedding?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700 p-3 rounded-xl hover:bg-gradient-to-r hover:from-amber-50 hover:to-rose-50 transition-all duration-300 border border-transparent hover:border-rose-100/30">
                  <span className="text-2xl w-8 text-amber-500">✦</span>
                  <span className="text-lg font-sans">Versatile Event Spaces — up to 300 guests</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 p-3 rounded-xl hover:bg-gradient-to-r hover:from-amber-50 hover:to-rose-50 transition-all duration-300 border border-transparent hover:border-rose-100/30">
                  <span className="text-2xl w-8 text-amber-500">✦</span>
                  <span className="text-lg font-sans">Romantic Ambience with stunning sea views</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 p-3 rounded-xl hover:bg-gradient-to-r hover:from-amber-50 hover:to-rose-50 transition-all duration-300 border border-transparent hover:border-rose-100/30">
                  <span className="text-2xl w-8 text-amber-500">✦</span>
                  <span className="text-lg font-sans">Professional Wedding Planner included</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 p-3 rounded-xl hover:bg-gradient-to-r hover:from-amber-50 hover:to-rose-50 transition-all duration-300 border border-transparent hover:border-rose-100/30">
                  <span className="text-2xl w-8 text-amber-500">✦</span>
                  <span className="text-lg font-sans">Exquisite catering and decoration</span>
                </div>
              </div>
              <button className="mt-8 px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-full font-semibold hover:from-amber-700 hover:to-amber-900 transition-all duration-500 shadow-lg hover:shadow-amber-500/30 transform hover:scale-105 font-sans tracking-wide">
                Plan Your Wedding →
              </button>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?w=800&h=500&fit=crop" 
                alt="Wedding"
                className="rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="relative py-12 overflow-hidden bg-cover bg-center" style={{ backgroundImage: backgroundImages.categories }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 z-10">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 shadow-md font-sans ${
                  activeCategory === cat.id
                    ? "bg-gradient-to-r from-amber-600 to-amber-800 text-white scale-105 shadow-lg"
                    : "bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white border border-white/30"
                }`}
              >
                <span className="text-sm">{cat.icon}</span>
                <span>{cat.name}</span>
                {activeCategory === cat.id && <span className="text-sm">✓</span>}
              </button>
            ))}
          </div>
          <div className="text-center mt-6">
            <p className="text-white text-sm bg-black/30 backdrop-blur-sm inline-block px-4 py-2 rounded-full shadow-sm border border-white/20 font-sans">
              ✦ {filteredServices.length} luxury experiences available ✦
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <div id="services-section" className="relative py-8 overflow-hidden bg-cover bg-center" style={{ backgroundImage: backgroundImages.services }}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 z-10">
          {filteredServices.length === 0 ? (
            <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl">
              <div className="text-6xl mb-4">✦</div>
              <h3 className="text-xl font-serif font-semibold text-gray-700 mb-2">No services found</h3>
              <p className="text-gray-500 font-sans">Try selecting a different category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service) => (
                <div key={service.id} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/20 hover:shadow-2xl transition-all duration-300">
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
      </div>

      {/* Footer */}
      <footer className="bg-[#1a2a3a] text-white/80 py-12 mt-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-serif font-bold text-white">Movenpick</h3>
              <p className="text-sm mt-2 text-white/60 font-sans">Siam Hotel Na Jomtien Pattaya</p>
              <p className="text-sm text-white/40 font-sans">Just 90 minutes from Bangkok</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3 font-sans">Quick Links</h4>
              <ul className="space-y-2 text-sm font-sans">
                <li><a href="#" className="hover:text-amber-400 transition">Rooms & Suites</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Restaurants</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Weddings</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Offers</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Facilities</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3 font-sans">Contact</h4>
              <ul className="space-y-2 text-sm font-sans">
                <li>📍 Na Jomtien Beach, Pattaya</li>
                <li>📞 +66 (0) 1234 5678</li>
                <li>✉️ info@movenpickpattaya.com</li>
                <li>🕐 24/7 Guest Service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3 font-sans">Newsletter</h4>
              <p className="text-sm text-white/60 font-sans">Subscribe for exclusive offers</p>
              <div className="flex mt-3">
                <input type="email" placeholder="Your email" className="px-4 py-2 rounded-l-full text-gray-800 w-full focus:outline-none font-sans" />
                <button className="px-4 py-2 bg-amber-600 rounded-r-full hover:bg-amber-700 transition font-sans">→</button>
              </div>
              <p className="text-xs text-white/40 mt-2 font-sans">Get 10% off your first stay</p>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/40 font-sans">
            <p>© 2024 Movenpick Siam Hotel Na Jomtien Pattaya. All rights reserved.</p>
            <p className="mt-1">Crafted with excellence for unforgettable moments</p>
          </div>
        </div>
      </footer>

      {/* Модальные окна */}
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
    </div>
  );
}