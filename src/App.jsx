// src/App.jsx
import { useState, useEffect } from "react";
import Header from "./components/Header";
import AdminPanel from "./components/AdminPanel";
import ServiceCard from "./components/ServiceCard";
import RequestForm from "./components/RequestForm";
import SuccessScreen from "./components/SuccessScreen";
import ReviewsList from "./components/ReviewsList";
import { supabase } from "./utils/supabase";
import { services as localServices } from "./data/services";

// Фоновые изображения для секций
const backgroundImages = {
  hero: "url(https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?w=1920&h=1080&fit=crop)",
  experience: "url(https://images.pexels.com/photos/2609221/pexels-photo-2609221.jpeg?w=1920&h=600&fit=crop)",
  dining: "url(https://images.pexels.com/photos/2609221/pexels-photo-2609221.jpeg?w=1920&h=600&fit=crop)",
  rooms: "url(https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?w=1920&h=600&fit=crop)",
  wedding: "url(https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?w=1920&h=600&fit=crop)",
  whyChoose: "url(https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?w=1920&h=600&fit=crop)",
  offers: "url(https://images.pexels.com/photos/2609221/pexels-photo-2609221.jpeg?w=1920&h=600&fit=crop)",
  servicesBg: "url(https://images.pexels.com/photos/2609221/pexels-photo-2609221.jpeg?w=1920&h=600&fit=crop)",
  categories: "url(https://images.pexels.com/photos/2609221/pexels-photo-2609221.jpeg?w=1920&h=400&fit=crop)"
};

const restaurants = [
  {
    id: 1,
    name: "T55 New York Grill Room",
    description: "Premium dry-aged steaks and signature Tomahawk cuts.",
    image: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?w=600&h=400&fit=crop"
  },
  {
    id: 2,
    name: "La Costa Poolside",
    description: "Casual poolside dining with light bites and refreshing drinks.",
    image: "https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?w=600&h=400&fit=crop"
  },
  {
    id: 3,
    name: "Red Coral Lounge",
    description: "Stylish lobby lounge with crafted cocktails and chic ambiance.",
    image: "https://images.pexels.com/photos/2609221/pexels-photo-2609221.jpeg?w=600&h=400&fit=crop"
  }
];

const rooms = [
  {
    id: 1,
    name: "Sea View Deluxe",
    description: "Private balcony with stunning ocean views, spacious bathtub.",
    image: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?w=600&h=400&fit=crop"
  },
  {
    id: 2,
    name: "Family Suite",
    description: "Connecting rooms for shared moments.",
    image: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?w=600&h=400&fit=crop"
  },
  {
    id: 3,
    name: "Panorama Club Room",
    description: "Exclusive access to Panorama Club Lounge.",
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
  const [services, setServices] = useState(localServices);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка данных из Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading data from Supabase...');
        
        // Загружаем услуги
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .order('id');
        
        if (servicesError) throw servicesError;
        
        if (servicesData && servicesData.length > 0) {
          setServices(servicesData);
          console.log('✅ Services loaded from Supabase:', servicesData.length);
        } else {
          console.log('No services in Supabase, using local data');
          setServices(localServices);
        }

        // Загружаем отзывы
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .order('date', { ascending: false });
        
        if (reviewsError) throw reviewsError;
        
        if (reviewsData && reviewsData.length > 0) {
          setAllReviews(reviewsData);
          console.log('✅ Reviews loaded from Supabase:', reviewsData.length);
        } else {
          // Если в Supabase нет отзывов, пробуем загрузить из localStorage
          const localReviews = JSON.parse(localStorage.getItem('hotel_reviews') || '[]');
          setAllReviews(localReviews);
          console.log('📦 Reviews loaded from localStorage:', localReviews.length);
        }
      } catch (error) {
        console.error('❌ Error loading data from Supabase:', error);
        // Fallback на локальные данные
        setServices(localServices);
        const localReviews = JSON.parse(localStorage.getItem('hotel_reviews') || '[]');
        setAllReviews(localReviews);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
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
    // Обновляем отзывы после закрытия
    const loadReviews = async () => {
      const { data } = await supabase.from('reviews').select('*').order('date', { ascending: false });
      if (data) setAllReviews(data);
    };
    loadReviews();
  };

  const handleAdminClose = () => {
    setShowAdminPanel(false);
    window.history.pushState({}, '', '/');
  };

  // Проверка URL на /admin
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin' || path === '/admin/' || path.startsWith('/admin')) {
      setShowAdminPanel(true);
    }
  }, []);

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

  if (showAdminPanel) {
    return <AdminPanel onClose={handleAdminClose} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f6f2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading experiences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f6f2] font-sans">
      <Header onCategoryClick={handleCategoryClick} />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-cover bg-center" style={{ backgroundImage: backgroundImages.hero }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 text-amber-400/10 text-7xl animate-float">✦</div>
          <div className="absolute bottom-10 right-10 text-amber-400/10 text-7xl animate-float-delayed">✦</div>
        </div>
        <div className="relative container mx-auto px-4 z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-amber-300 text-sm tracking-[0.3em] mb-4 animate-fadeInUp">
              <span className="w-12 h-0.5 bg-gradient-to-r from-amber-400/50 to-transparent"></span>
              <span>MÖVENPICK SIAM HOTEL</span>
              <span className="w-12 h-0.5 bg-gradient-to-l from-amber-400/50 to-transparent"></span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-[1.1] mb-4 animate-fadeInUp delay-200">
              Family Paradise
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">in Pattaya</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-6 animate-fadeInUp delay-400 font-light leading-relaxed">
              Welcome to Na Jomtien Beach, home of Mövenpick Siam Hotel. A beachfront resort featuring sea view rooms, a lagoon pool, spa, and warm Swiss hospitality.
            </p>
            <div className="flex flex-wrap gap-3 animate-fadeInUp delay-600">
              <button onClick={() => document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="group bg-gradient-to-r from-amber-500 to-amber-700 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-600 hover:to-amber-800 transition-all duration-500 shadow-2xl hover:shadow-amber-500/30 transform hover:scale-105 flex items-center gap-2">
                <span>Explore Experiences</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </button>
              <button onClick={() => document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="border-2 border-white/30 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all duration-500 backdrop-blur-sm">
                View Services
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <div className="relative -mt-8 z-20">
        <div className="container mx-auto px-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 max-w-4xl mx-auto border border-amber-100/30">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <span className="text-amber-600 font-semibold text-sm tracking-wider">EXPLORE SERVICES</span>
              <span className="text-gray-300">|</span>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                      activeCategory === cat.id
                        ? "bg-gradient-to-r from-amber-500 to-amber-700 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name === "All Services" ? "All" : cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div id="services-section" className="relative py-12 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-amber-600 font-semibold tracking-[0.2em] text-sm">EXPERIENCES</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 text-gray-800">Discover Our Services</h2>
            <p className="text-gray-500 max-w-2xl mx-auto mt-2 font-light">Choose from our wide range of premium experiences</p>
          </div>

          {filteredServices.length === 0 ? (
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl">
              <div className="text-6xl mb-4">✦</div>
              <h3 className="text-xl font-serif font-semibold text-gray-700 mb-2">No services found</h3>
              <p className="text-gray-500">Try selecting a different category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service, index) => (
                <div key={service.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-100/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <ServiceCard service={service} onBookNow={handleBookNow} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Experience Section */}
      <section className="relative py-16 overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: backgroundImages.experience }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 z-10">
          <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-amber-100/30">
            <div className="text-center">
              <span className="text-amber-600 font-semibold tracking-[0.2em] text-sm">EXPERIENCE</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2 mb-4 text-gray-800">Your Family Escape by the Sea</h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">Nestled in one of Pattaya's most peaceful coastal areas, this beachfront resort features sea view rooms, a lagoon pool, spa, and warm Swiss hospitality. Just 2 hours from Bangkok, it's a perfect escape for your next seaside retreat.</p>
              <div className="flex flex-wrap justify-center gap-8 mt-6">
                <div><span className="text-3xl font-bold text-amber-600">262</span><p className="text-sm text-gray-500">Elegant Rooms</p></div>
                <div><span className="text-3xl font-bold text-amber-600">2hrs</span><p className="text-sm text-gray-500">From Bangkok</p></div>
                <div><span className="text-3xl font-bold text-amber-600">★ 4.8</span><p className="text-sm text-gray-500">Guest Rating</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurants & Bars */}
      <section className="relative py-16 overflow-hidden bg-cover bg-center" style={{ backgroundImage: backgroundImages.dining }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container mx-auto px-4 z-10">
          <div className="text-center mb-12">
            <span className="text-amber-400 font-semibold tracking-[0.2em] text-sm">DINING</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 text-white">Restaurants & Bars</h2>
            <p className="text-white/70 max-w-2xl mx-auto mt-2 text-lg font-light">Discover where the best restaurants gather to provide a rich and flavorful dining journey</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {restaurants.map((item) => (
              <div key={item.id} className="group bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-3">
                <div className="relative h-56 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors">{item.name}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm font-light">{item.description}</p>
                  <button className="mt-4 text-amber-600 font-semibold hover:text-amber-700 transition-all flex items-center gap-2 group-hover:gap-4 text-sm">Learn more <span className="transition-transform">→</span></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms & Suites */}
      <section className="relative py-16 overflow-hidden bg-cover bg-center" style={{ backgroundImage: backgroundImages.rooms }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container mx-auto px-4 z-10">
          <div className="text-center mb-12">
            <span className="text-amber-400 font-semibold tracking-[0.2em] text-sm">ACCOMMODATION</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 text-white">Rooms & Suites</h2>
            <p className="text-white/70 max-w-2xl mx-auto mt-2 text-lg font-light">Find your perfect accommodation with stunning sea views from private balconies</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room.id} className="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-3">
                <img src={room.image} alt={room.name} className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 p-6 text-white">
                  <h3 className="text-xl font-serif font-bold">{room.name}</h3>
                  <p className="text-sm opacity-80 mt-1 leading-relaxed font-light">{room.description}</p>
                  <button className="mt-3 px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full text-sm font-semibold hover:from-amber-600 hover:to-amber-800 transition-all shadow-lg hover:shadow-amber-500/30 transform hover:scale-105">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Movenpick */}
      <section className="relative py-16 overflow-hidden bg-cover bg-center" style={{ backgroundImage: backgroundImages.whyChoose }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative container mx-auto px-4 z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">Why Choose Movenpick</h2>
            <p className="text-white/70 max-w-2xl mx-auto mt-2 text-lg font-light">Life tastes better at Movenpick Pattaya</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: "🌅", title: "Panoramic Views", desc: "Stunning sea views from private balconies" },
              { icon: "🏖️", title: "Pristine Beachfront", desc: "Quiet sands of Na Jomtien Beach" },
              { icon: "🍫", title: "Free Chocolate Hour", desc: "60 minutes of daily bliss" },
              { icon: "👨‍👩‍👧", title: "Family First", desc: "Activities for all ages" }
            ].map((item, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/95 transition-all duration-500 hover:-translate-y-2">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-serif font-bold text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1 font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="relative py-16 overflow-hidden bg-cover bg-center" style={{ backgroundImage: backgroundImages.offers }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container mx-auto px-4 z-10">
          <div className="text-center mb-10">
            <span className="text-amber-400 font-semibold tracking-[0.2em] text-sm">OFFERS</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 text-white">Double the Joy</h2>
            <p className="text-white/70 max-w-2xl mx-auto mt-2 text-lg font-light">Save up to 25% on your next coastal escape</p>
          </div>
          <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-2xl border border-amber-100/30">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-6xl font-bold text-amber-600">25%</span>
                  <span className="text-2xl font-bold text-amber-600">OFF</span>
                </div>
                <p className="text-2xl font-serif mt-2 text-gray-800">Stay in the Moment</p>
                <p className="text-gray-500 text-sm mt-1 font-light">Valid for stays until 30 September 2026</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-amber-100/70 px-3 py-1 rounded-full text-amber-700 text-xs font-medium">🌅 Sea View Rooms</span>
                  <span className="bg-amber-100/70 px-3 py-1 rounded-full text-amber-700 text-xs font-medium">🍫 Chocolate Hour</span>
                </div>
              </div>
              <button className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-700 text-white rounded-full font-semibold hover:from-amber-600 hover:to-amber-800 transition-all duration-500 shadow-lg hover:shadow-amber-500/30 transform hover:scale-105">Book Now →</button>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Section */}
      <section className="relative py-16 overflow-hidden bg-cover bg-center" style={{ backgroundImage: backgroundImages.wedding }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container mx-auto px-4 z-10">
          <div className="text-center mb-10">
            <span className="text-amber-400 font-semibold tracking-[0.2em] text-sm">WEDDING</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 text-white">Plan Your Wedding</h2>
            <p className="text-white/70 max-w-2xl mx-auto mt-2 text-lg font-light">The Perfect Backdrop for Your "I Do"</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-rose-100/30">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700 p-3 rounded-xl hover:bg-amber-50 transition-all duration-300">
                  <span className="text-2xl text-amber-500">✦</span>
                  <span className="font-light">Versatile Event Spaces — up to 300 guests</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 p-3 rounded-xl hover:bg-amber-50 transition-all duration-300">
                  <span className="text-2xl text-amber-500">✦</span>
                  <span className="font-light">Romantic Ambience with stunning sea views</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 p-3 rounded-xl hover:bg-amber-50 transition-all duration-300">
                  <span className="text-2xl text-amber-500">✦</span>
                  <span className="font-light">Professional Wedding Planner included</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 p-3 rounded-xl hover:bg-amber-50 transition-all duration-300">
                  <span className="text-2xl text-amber-500">✦</span>
                  <span className="font-light">Exquisite catering and decoration</span>
                </div>
              </div>
              <button className="mt-6 px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-full font-semibold hover:from-amber-700 hover:to-amber-900 transition-all duration-500 shadow-lg hover:shadow-amber-500/30 transform hover:scale-105">Plan Your Wedding →</button>
            </div>
            <div className="hidden md:block">
              <img src="https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?w=600&h=400&fit=crop" alt="Wedding" className="rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a2a3a] text-white/80 py-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-serif font-bold text-white">Movenpick</h3>
              <p className="text-sm mt-2 text-white/50 font-light">Siam Hotel Na Jomtien Pattaya</p>
              <p className="text-sm text-white/40 font-light">Just 90 minutes from Bangkok</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm font-light">
                <li><a href="#" className="hover:text-amber-400 transition-colors">Rooms & Suites</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Restaurants</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Weddings</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Offers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Contact</h4>
              <ul className="space-y-2 text-sm font-light">
                <li>📍 Na Jomtien Beach, Pattaya</li>
                <li>📞 +66 (0) 1234 5678</li>
                <li>✉️ info@movenpickpattaya.com</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Newsletter</h4>
              <p className="text-sm text-white/50 font-light">Subscribe for exclusive offers</p>
              <div className="flex mt-3">
                <input type="email" placeholder="Your email" className="px-4 py-2 rounded-l-full text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-amber-500" />
                <button className="px-4 py-2 bg-amber-600 rounded-r-full hover:bg-amber-700 transition">→</button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-white/30 font-light">
            <p>© 2024 Movenpick Siam Hotel Na Jomtien Pattaya. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Модальные окна */}
      {showForm && selectedService && (
        <RequestForm service={selectedService} onClose={handleCloseForm} onSuccess={handleSuccess} />
      )}
      {successRequest && (
        <SuccessScreen request={successRequest} onClose={handleCloseSuccess} />
      )}
    </div>
  );
}