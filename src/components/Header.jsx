// src/components/Header.jsx
import { useState, useEffect } from "react";

export default function Header({ onCategoryClick }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrolled = scrollY > 50;
      setIsScrolled(scrolled);
      
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
      {/* Top Bar */}
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
        {/* Фоновое изображение */}
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

        {/* Декоративная линия */}
        {!isScrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent"></div>
        )}

        <div className="relative container mx-auto px-4 md:px-6 z-10">
          <div className="flex justify-between items-center">
            {/* Logo - Playfair Display */}
            <a 
              href="#" 
              className="flex items-center gap-2 group"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActiveLink("home");
              }}
            >
              <div className="flex flex-col items-start">
                <span 
                  className={`text-xl md:text-2xl font-bold tracking-tight transition-colors duration-500 ${
                    isScrolled ? "text-amber-800" : "text-white drop-shadow-lg"
                  }`}
                  style={{ 
                    fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif !important",
                    fontWeight: 700
                  }}
                >
                  Mövenpick
                </span>
                <span 
                  className={`text-[8px] tracking-[0.3em] uppercase transition-colors duration-500 ${
                    isScrolled ? "text-gray-400" : "text-white/60"
                  }`}
                  style={{ 
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important",
                    fontWeight: 400
                  }}
                >
                  Hotel & Resort
                </span>
              </div>
            </a>

            {/* Desktop Navigation - Inter */}
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
                      style={{ 
                        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important",
                        fontWeight: 500
                      }}
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

            {/* Right Section - Book Now */}
            <div className="hidden lg:flex items-center gap-3">
              <button 
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-500 shadow-md hover:shadow-lg transform hover:scale-105 tracking-wide ${
                  isScrolled 
                    ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800" 
                    : "bg-white text-amber-700 hover:bg-gray-100"
                }`}
                style={{ 
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important",
                  fontWeight: 600
                }}
              >
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
                style={{ 
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important",
                  fontWeight: 500
                }}
              >
                <span className="text-base">{link.icon}</span>
                <span>{link.name}</span>
              </button>
            ))}
            <div className="pt-4 border-t border-white/10">
              <button 
                className={`w-full px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 ${
                  isScrolled 
                    ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white" 
                    : "bg-white text-amber-700"
                }`}
                style={{ 
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important",
                  fontWeight: 600
                }}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}