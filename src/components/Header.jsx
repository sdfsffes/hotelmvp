// src/components/Header.jsx
import { useState, useEffect } from "react";

export default function Header({ onAdminClick, onCategoryClick }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrolled = scrollY > 50;
      setIsScrolled(scrolled);
      
      // Прогресс скролла для плавного перехода (0-1)
      const progress = Math.min(scrollY / 150, 1);
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "home", name: "Home", icon: "✦" },
    { id: "experiences", name: "Experiences", icon: "✦" }
  ];

  const handleNavClick = (linkId) => {
    setActiveLink(linkId);
    if (linkId === "home") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (linkId === "experiences") {
      setTimeout(() => {
        const section = document.getElementById('services-section');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  // Плавный переход фона
  const headerStyle = {
    backgroundColor: isScrolled 
      ? 'rgba(255, 255, 255, 0.95)' 
      : `rgba(26, 42, 58, ${1 - scrollProgress * 0.3})`,
    backdropFilter: isScrolled ? 'blur(20px)' : 'blur(0px)',
    boxShadow: isScrolled ? '0 10px 40px -15px rgba(0,0,0,0.15)' : 'none',
    borderBottom: isScrolled ? '1px solid rgba(0,0,0,0.05)' : 'none'
  };

  return (
    <>
      {/* Top Bar - премиальный */}
      <div className={`hidden lg:block transition-all duration-700 ${
        isScrolled 
          ? "bg-[#1a2a3a]/80 backdrop-blur-md py-1.5 opacity-90" 
          : "bg-[#1a2a3a] py-2 opacity-100"
      }`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="text-amber-400/60 text-[10px] tracking-[0.3em] uppercase">✦</span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-white/60 font-light">Swiss Hospitality</span>
            <span className="text-amber-400/60 text-[10px]">✦</span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-white/60 font-light">Since 1948</span>
            <span className="text-amber-400/60 text-[10px]">✦</span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-white/60 font-light">World Travel Awards</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] tracking-[0.1em] text-white/40 font-light">Winner 2024</span>
            <span className="text-[10px] tracking-[0.1em] text-white/40 font-light">Luxury Hotel Award</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header 
        className="sticky top-0 z-50 transition-all duration-700 py-4"
        style={headerStyle}
      >
        {/* Фоновое изображение (видно только когда не скроллим) */}
        {!isScrolled && (
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url(https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?w=1920&h=400&fit=crop)",
                backgroundPosition: "center 30%",
                opacity: 0.6
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/60"></div>
          </div>
        )}

        {/* Декоративный элемент - тонкая линия внизу */}
        {!isScrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent"></div>
        )}

        <div className="relative container mx-auto px-4 md:px-6 z-10">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <a 
              href="#" 
              className="flex items-center gap-3 group"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActiveLink("home");
              }}
            >
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full blur-xl transition-opacity duration-700 ${
                  isScrolled ? "opacity-60 group-hover:opacity-100" : "opacity-40 group-hover:opacity-100"
                }`}></div>
                <div className={`relative bg-gradient-to-r from-amber-600 to-amber-800 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-105 ${
                  isScrolled ? "" : "ring-2 ring-white/20"
                }`}>
                  <span className={`text-xl font-serif font-bold ${
                    isScrolled ? "text-white" : "text-white"
                  }`}>M</span>
                </div>
              </div>
              <div>
                <h1 className={`text-xl md:text-2xl font-serif font-bold tracking-tight transition-colors duration-500 ${
                  isScrolled ? "text-gray-800" : "text-white drop-shadow-lg"
                }`}>
                  Movenpick
                </h1>
                <p className={`text-[9px] tracking-[0.3em] uppercase transition-colors duration-500 ${
                  isScrolled ? "text-gray-400" : "text-white/60"
                }`}>Hotel & Resort</p>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:block">
              <ul className="flex gap-1">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => handleNavClick(link.id)}
                      className={`relative px-4 py-2 text-sm font-medium transition-all duration-500 group flex items-center gap-1 ${
                        activeLink === link.id
                          ? isScrolled ? "text-amber-700" : "text-amber-300"
                          : isScrolled ? "text-gray-700 hover:text-amber-600" : "text-white/90 hover:text-white"
                      }`}
                    >
                      <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">{link.icon}</span>
                      <span>{link.name}</span>
                      {activeLink === link.id && (
                        <span className={`absolute bottom-0 left-0 w-full h-0.5 rounded-full transition-all duration-500 ${
                          isScrolled ? "bg-amber-500" : "bg-amber-400"
                        }`}></span>
                      )}
                      <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-500 rounded-full group-hover:w-full ${
                        isScrolled ? "bg-amber-500" : "bg-amber-400"
                      } ${activeLink === link.id ? 'hidden' : ''}`}></span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right Section */}
            <div className="hidden lg:flex items-center gap-3">
              <button className={`p-2 transition-colors duration-300 ${
                isScrolled ? "text-gray-500 hover:text-amber-600" : "text-white/70 hover:text-white"
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              <button
                onClick={onAdminClick}
                className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium text-sm flex items-center gap-2 ${
                  isScrolled 
                    ? "bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-amber-700" 
                    : "bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/10"
                }`}
              >
                <span className="text-sm">⚙</span>
                <span>Admin</span>
              </button>
              
              <button className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-500 shadow-md hover:shadow-lg transform hover:scale-105 tracking-wide ${
                isScrolled 
                  ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800" 
                  : "bg-white text-amber-700 hover:bg-gray-100"
              }`}>
                Book Now
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors duration-300 ${
                isScrolled ? "hover:bg-gray-100" : "hover:bg-white/10"
              }`}
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`w-6 h-0.5 transition-all duration-300 ${
                  isScrolled ? "bg-gray-600" : "bg-white"
                } ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-6 h-0.5 transition-all duration-300 ${
                  isScrolled ? "bg-gray-600" : "bg-white"
                } ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-6 h-0.5 transition-all duration-300 ${
                  isScrolled ? "bg-gray-600" : "bg-white"
                } ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-700 ${isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className={`mt-4 py-4 px-4 space-y-2 ${
            isScrolled 
              ? "bg-white border-t shadow-xl" 
              : "bg-[#1a2a3a]/95 backdrop-blur-md border-t border-white/10"
          }`}>
            {navLinks.map((link) => (
              <button
                key={link.id}
                className={`flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-all duration-300 w-full text-left ${
                  isScrolled 
                    ? "text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-amber-100" 
                    : "text-white/90 hover:bg-white/10"
                }`}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleNavClick(link.id);
                }}
              >
                <span className="text-base">{link.icon}</span>
                <span>{link.name}</span>
              </button>
            ))}
            <div className="pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onAdminClick();
                }}
                className={`flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-all duration-300 w-full ${
                  isScrolled 
                    ? "text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-amber-100" 
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                <span className="text-base">⚙</span>
                <span>Admin Panel</span>
              </button>
            </div>
            <div className="pt-4">
              <button className={`w-full px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 ${
                isScrolled 
                  ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white" 
                  : "bg-white text-amber-700"
              }`}>
                Book Now
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}