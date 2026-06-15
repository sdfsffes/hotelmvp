// src/components/Header.jsx
import { useState, useEffect } from "react";

export default function Header({ onAdminClick }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "home", name: "Home", icon: "🏠", href: "#" },
    { id: "experiences", name: "Experiences", icon: "✨", href: "#services" },
    { id: "dining", name: "Dining", icon: "🍽️", href: "#dining" },
    { id: "wellness", name: "Wellness", icon: "💆", href: "#wellness" },
    { id: "offers", name: "Offers", icon: "🎁", href: "#offers" },
    { id: "contact", name: "Contact", icon: "📞", href: "#contact" }
  ];

  return (
    <>
      {/* Top Bar - всегда темный с белым текстом */}
      <div className="hidden lg:block bg-[#1a1a2e] text-white py-2">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-amber-400">✦</span>
              <span className="text-[11px]">Swiss Hospitality</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400">✦</span>
              <span className="text-[11px]">5-Star Luxury</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400">✦</span>
              <span className="text-[11px]">World Travel Awards</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-[11px]">
              <span>🏆</span>
              <span>Winner 2024</span>
            </div>
            <div className="flex items-center gap-1 text-[11px]">
              <span>⭐</span>
              <span>Luxury Hotel Award</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-white shadow-xl py-3" 
            : "bg-[#1a1a2e] py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity`}></div>
                <div className="relative bg-gradient-to-r from-amber-600 to-amber-800 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all group-hover:scale-105">
                  <span className="text-2xl">🏨</span>
                </div>
              </div>
              <div>
                <h1 className={`text-xl md:text-2xl font-serif font-bold tracking-tight transition-colors ${
                  isScrolled ? "text-gray-800" : "text-white"
                }`}>
                  Movenpick
                </h1>
                <p className={`text-[9px] tracking-[3px] transition-colors ${
                  isScrolled ? "text-gray-400" : "text-white/70"
                }`}>HOTEL & RESORT</p>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:block">
              <ul className="flex gap-1">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      onClick={() => setActiveLink(link.id)}
                      className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 group flex items-center gap-1 ${
                        activeLink === link.id
                          ? isScrolled ? "text-amber-700" : "text-amber-300"
                          : isScrolled ? "text-gray-700 hover:text-amber-600" : "text-white/90 hover:text-white"
                      }`}
                    >
                      <span className="text-base opacity-0 group-hover:opacity-100 transition-opacity">
                        {link.icon}
                      </span>
                      <span>{link.name}</span>
                      {activeLink === link.id && (
                        <span className={`absolute bottom-0 left-0 w-full h-0.5 rounded-full ${
                          isScrolled ? "bg-amber-500" : "bg-amber-400"
                        }`}></span>
                      )}
                      <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 rounded-full group-hover:w-full ${
                        isScrolled ? "bg-amber-500" : "bg-amber-400"
                      }`}></span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right Section */}
            <div className="hidden lg:flex items-center gap-3">
              <button className={`p-2 transition-colors ${
                isScrolled ? "text-gray-500 hover:text-amber-600" : "text-white/90 hover:text-white"
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              {/* Admin Button */}
              <button
                onClick={onAdminClick}
                className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium text-sm flex items-center gap-2 ${
                  isScrolled 
                    ? "bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-amber-700" 
                    : "bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                }`}
              >
                <span className="text-base">🛡️</span>
                <span>Admin</span>
              </button>
              
              {/* Book Now Button */}
              <button className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                isScrolled 
                  ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white" 
                  : "bg-white text-amber-700 hover:bg-gray-100"
              }`}>
                BOOK NOW
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
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
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className={`mt-4 py-4 px-4 space-y-2 ${
            isScrolled 
              ? "bg-white border-t shadow-lg" 
              : "bg-[#1a1a2e] border-t border-white/10"
          }`}>
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-all ${
                  isScrolled 
                    ? "text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-amber-100" 
                    : "text-white/90 hover:bg-white/10"
                }`}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setActiveLink(link.id);
                }}
              >
                <span className="text-xl">{link.icon}</span>
                <span>{link.name}</span>
              </a>
            ))}
            <div className="pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onAdminClick();
                }}
                className={`flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-all w-full ${
                  isScrolled 
                    ? "text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-amber-100" 
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                <span className="text-xl">🛡️</span>
                <span>Admin Panel</span>
              </button>
            </div>
            <div className="pt-4">
              <button className={`w-full px-6 py-3 rounded-xl font-semibold shadow-md transition-all ${
                isScrolled 
                  ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white" 
                  : "bg-white text-amber-700"
              }`}>
                BOOK NOW
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}