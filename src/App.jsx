// src/App.jsx
import { useState, useEffect } from "react";
import Header from "./components/Header";
import AdminPanel from "./components/AdminPanel";
import ServiceCard from "./components/ServiceCard";
import RequestForm from "./components/RequestForm";
import SuccessScreen from "./components/SuccessScreen";
import { useLanguage } from "./context/LanguageContext";
import { services } from "./data/services";

// Фоновые изображения для секций
const backgroundImages = {
  hero: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&h=1080&fit=crop",
  experience: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=600&fit=crop",
  dining: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=600&fit=crop",
  rooms: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1920&h=600&fit=crop",
  wedding: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=600&fit=crop"
};

// Данные для премиум-блоков
const restaurants = [
  {
    id: 1,
    nameKey: "t55",
    name: "T55 New York Grill Room",
    descriptionKey: "t55Desc",
    description: "Premium dry-aged steaks and signature Tomahawk cuts, New York–inspired style and seaside sophistication.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop"
  },
  {
    id: 2,
    nameKey: "laCosta",
    name: "La Costa Poolside",
    descriptionKey: "laCostaDesc",
    description: "Casual poolside dining with light bites, pizzas, and refreshing drinks paired with sea breezes.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop"
  },
  {
    id: 3,
    nameKey: "redCoral",
    name: "Red Coral Lounge",
    descriptionKey: "redCoralDesc",
    description: "Stylish lobby lounge with aromatic coffees, crafted cocktails, and chic evening ambiance.",
    image: "https://images.unsplash.com/photo-1537640538966-79f369c1a50e?w=600&h=400&fit=crop"
  }
];

const rooms = [
  {
    id: 1,
    nameKey: "seaViewDeluxe",
    name: "Sea View Deluxe",
    descriptionKey: "seaViewDeluxeDesc",
    description: "Private balcony with stunning ocean views, spacious bathtub for relaxing soaks.",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=400&fit=crop"
  },
  {
    id: 2,
    nameKey: "familySuite",
    name: "Family Suite",
    descriptionKey: "familySuiteDesc",
    description: "Connecting rooms for shared moments, perfect for family holidays by the sea.",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop"
  },
  {
    id: 3,
    nameKey: "panoramaClub",
    name: "Panorama Club Room",
    descriptionKey: "panoramaClubDesc",
    description: "Exclusive access to Panorama Club Lounge with sweeping ocean views.",
    image: "https://images.unsplash.com/photo-1560185008-5f4b6d0f4d8b?w=600&h=400&fit=crop"
  }
];

const categories = [
  { id: "all", nameKey: "allServices", name: "All Services", icon: "🏠" },
  { id: "Dining", nameKey: "dining", name: "Dining", icon: "🍽️" },
  { id: "Wellness", nameKey: "wellness", name: "Wellness", icon: "💆" },
  { id: "Adventure", nameKey: "adventure", name: "Adventure", icon: "⛵" },
  { id: "Activities", nameKey: "activities", name: "Activities", icon: "🎨" },
  { id: "Family", nameKey: "family", name: "Family", icon: "👨‍👩‍👧" }
];

export default function App() {
  const { translate, language } = useLanguage();
  const [selectedService, setSelectedService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successRequest, setSuccessRequest] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

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
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onAdminClick={() => setShowAdminPanel(true)} 
        onCategoryClick={handleCategoryClick}
      />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImages.hero})` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
        <div className="relative container mx-auto px-4 z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-amber-400 text-sm tracking-widest mb-4">
              <span>✦</span>
              <span>{translate('heroBadge')}</span>
              <span>✦</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-6">
              {translate('heroTitle')}
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-xl">
              {translate('heroSubtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => {
                  document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {translate('exploreExperiences')}
              </button>
              <button 
                onClick={() => {
                  document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="border-2 border-white/50 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                {translate('viewServices')}
              </button>
            </div>
            <div className="mt-12 flex flex-wrap gap-8 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-amber-400">✦</span>
                <span>262 {translate('elegantRooms')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400">✦</span>
                <span>2hrs {translate('fromBangkok')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400">✦</span>
                <span>★ 4.8 {translate('guestRating')}</span>
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
      <section className="relative py-20 overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${backgroundImages.experience})` }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container mx-auto px-4 z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
              <span className="text-amber-600 font-semibold tracking-widest text-sm">{translate('experience')}</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 mb-4 text-gray-800">
                {translate('experienceTitle')}
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                {translate('experienceDesc')}
              </p>
              <div className="flex gap-8">
                <div>
                  <span className="text-3xl font-bold text-amber-600">262</span>
                  <p className="text-sm text-gray-500">{translate('elegantRooms')}</p>
                </div>
                <div>
                  <span className="text-3xl font-bold text-amber-600">2hrs</span>
                  <p className="text-sm text-gray-500">{translate('fromBangkok')}</p>
                </div>
                <div>
                  <span className="text-3xl font-bold text-amber-600">★ 4.8</span>
                  <p className="text-sm text-gray-500">{translate('guestRating')}</p>
                </div>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </section>

      {/* Restaurants & Bars */}
      <section className="relative py-20 overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImages.dining})` }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 z-10">
          <div className="text-center mb-12">
            <span className="text-amber-400 font-semibold tracking-widest text-sm">{translate('dining')}</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 text-white">{translate('diningTitle')}</h2>
            <p className="text-white/80 max-w-2xl mx-auto mt-2">{translate('diningDesc')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {restaurants.map((item) => (
              <div key={item.id} className="bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
                <div className="relative h-56 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                  <button className="mt-4 text-amber-600 font-semibold hover:text-amber-700 transition flex items-center gap-1">
                    {translate('learnMore')} <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms & Suites */}
      <section className="relative py-20 overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImages.rooms})` }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container mx-auto px-4 z-10">
          <div className="text-center mb-12">
            <span className="text-amber-400 font-semibold tracking-widest text-sm">{translate('accommodation')}</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 text-white">{translate('roomsTitle')}</h2>
            <p className="text-white/80 max-w-2xl mx-auto mt-2">{translate('roomsDesc')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div key={room.id} className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <img src={room.image} alt={room.name} className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 p-6 text-white">
                  <h3 className="text-2xl font-bold">{room.name}</h3>
                  <p className="text-sm opacity-90 mt-1">{room.description}</p>
                  <button className="mt-3 px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-sm font-semibold hover:from-amber-600 hover:to-orange-600 transition shadow-lg">
                    {translate('viewDetails')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-r from-amber-50 to-orange-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800">{translate('whyChoose')}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto mt-2">{translate('whyChooseDesc')}</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-5xl mb-4">🌅</div>
              <h3 className="font-bold text-lg text-gray-800">{translate('panoramicViews')}</h3>
              <p className="text-gray-500 text-sm mt-2">{translate('panoramicDesc')}</p>
            </div>
            <div className="text-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-5xl mb-4">🏖️</div>
              <h3 className="font-bold text-lg text-gray-800">{translate('beachfront')}</h3>
              <p className="text-gray-500 text-sm mt-2">{translate('beachfrontDesc')}</p>
            </div>
            <div className="text-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-5xl mb-4">🍫</div>
              <h3 className="font-bold text-lg text-gray-800">{translate('chocolate')}</h3>
              <p className="text-gray-500 text-sm mt-2">{translate('chocolateDesc')}</p>
            </div>
            <div className="text-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-5xl mb-4">👨‍👩‍👧</div>
              <h3 className="font-bold text-lg text-gray-800">{translate('familyFirst')}</h3>
              <p className="text-gray-500 text-sm mt-2">{translate('familyDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-amber-600 font-semibold tracking-widest text-sm">{translate('offers')}</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 text-gray-800">{translate('offersTitle')}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto mt-2">{translate('offersDesc')}</p>
          </div>
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl p-8 md:p-12 shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <span className="text-6xl font-bold">25% {translate('off')}</span>
                <p className="text-2xl font-serif mt-2">{translate('stayMoment')}</p>
                <p className="opacity-90 text-sm mt-1">{translate('validUntil')}</p>
                <div className="flex gap-4 mt-3 text-sm">
                  <span className="bg-white/20 px-3 py-1 rounded-full">🌅 {translate('seaView')}</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full">🍫 {translate('chocolate')}</span>
                </div>
              </div>
              <button className="px-8 py-3 bg-white text-amber-600 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg transform hover:scale-105">
                {translate('bookNow')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Section */}
      <section className="relative py-20 overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImages.wedding})` }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
              <span className="text-amber-600 font-semibold tracking-widest text-sm">{translate('wedding')}</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 mb-4 text-gray-800">
                {translate('weddingTitle')}
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                {translate('weddingDesc')}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-2xl">🤵</span>
                  <span>{translate('versatileSpaces')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-2xl">🌅</span>
                  <span>{translate('romanticAmbience')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-2xl">👰</span>
                  <span>{translate('weddingPlanner')}</span>
                </div>
              </div>
              <button className="mt-8 px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full font-semibold hover:from-amber-700 hover:to-orange-700 transition shadow-lg">
                {translate('planWedding')}
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
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white scale-105 shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{translate(cat.nameKey) || cat.name}</span>
              {activeCategory === cat.id && <span className="text-sm">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div id="services-section" className="container mx-auto px-4 py-8 scroll-mt-20">
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm bg-white/80 inline-block px-4 py-2 rounded-full shadow-sm">
            ✨ {filteredServices.length} {translate('servicesAvailable')} ✨
          </p>
        </div>

        {filteredServices.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{translate('noServices')}</h3>
            <p className="text-gray-500">{translate('tryDifferent')}</p>
            <button
              onClick={() => {
                setActiveCategory("all");
              }}
              className="mt-4 text-amber-600 hover:text-amber-700 font-semibold transition"
            >
              {translate('viewAll')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBookNow={handleBookNow}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#1a1a2e] text-white/80 py-12 mt-8">
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
              <h4 className="font-bold text-white mb-3">{translate('quickLinks')}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-amber-400 transition">{translate('roomsSuites')}</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">{translate('restaurants')}</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">{translate('weddings')}</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">{translate('offersLink')}</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">{translate('facilities')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">{translate('contact')}</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">📍 Na Jomtien Beach, Pattaya</li>
                <li className="flex items-center gap-2">📞 +66 (0) 1234 5678</li>
                <li className="flex items-center gap-2">✉️ info@movenpickpattaya.com</li>
                <li className="flex items-center gap-2">🕐 24/7 Guest Service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">{translate('newsletter')}</h4>
              <p className="text-sm text-white/60">{translate('subscribe')}</p>
              <div className="flex mt-3">
                <input type="email" placeholder={translate('yourEmail')} className="px-4 py-2 rounded-l-full text-gray-800 w-full focus:outline-none" />
                <button className="px-4 py-2 bg-amber-600 rounded-r-full hover:bg-amber-700 transition">→</button>
              </div>
              <p className="text-xs text-white/40 mt-2">{translate('getOffer')}</p>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/40">
            <p>{translate('copyright')}</p>
            <p className="mt-1">{translate('crafted')}</p>
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