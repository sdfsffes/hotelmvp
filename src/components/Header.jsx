// src/components/Header.jsx
import { useState, useEffect } from "react";

export default function Header({ onAdminClick, onCategoryClick }) {
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
    { id: "home", name: "Home", icon: "✦" },
    { id: "experiences", name: "Experiences", icon: "✨" }
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

  return (
    <>
      {/* Top Bar */}
      <div className="hidden lg:block bg-[#1a1a2e] text-white/80 py-2">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-amber-400">✦</span>
              <span className="text-[11px] tracking-wide">SWISS HOSPITALITY</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400">✦</span>
              <span className="text-[11px] tracking-wide">SINCE 1948</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400">✦</span>
              <span className="text-[11px] tracking-wide">WORLD TRAVEL AWARDS</span>
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
        className={`sticky top-0 z-50 transition-all duration-700 ${
          isScrolled 
            ? "bg-white/95 backdrop-blur-xl shadow-2xl py-3" 
            : "bg-white shadow-md py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
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
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-amber-600 to-amber-800 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all group-hover:scale-105">
                  <span className="text-2xl">🏨</span>
                </div>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-serif font-bold tracking-tight text-gray-800">
                  Movenpick
                </h1>
                <p className="text-[9px] tracking-[3px] text-gray-400">HOTEL & RESORT</p>
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
                          ? "text-amber-700"
                          : "text-gray-700 hover:text-amber-600"
                      }`}
                    >
                      <span className="text-xs">{link.icon}</span>
                      <span>{link.name}</span>
                      {activeLink === link.id && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full"></span>
                      )}
                      <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-700 transition-all duration-300 rounded-full group-hover:w-full ${
                        activeLink === link.id ? 'hidden' : ''
                      }`}></span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right Section */}
            <div className="hidden lg:flex items-center gap-3">
              <button className="p-2 text-gray-500 hover:text-amber-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              <button
                onClick={onAdminClick}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-amber-700 transition-all duration-300 font-medium text-sm flex items-center gap-2"
              >
                <span className="text-base">🛡️</span>
                <span>Admin</span>
              </button>
              
              <button className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-2 rounded-full text-sm font-semibold hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                BOOK NOW
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`w-6 h-0.5 bg-gray-600 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-gray-600 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-gray-600 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-700 ${isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white border-t mt-4 py-4 px-4 space-y-2 shadow-xl">
            {navLinks.map((link) => (
              <button
                key={link.id}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium hover:bg-gradient-to-r hover:from-amber-50 hover:to-amber-100 rounded-xl transition-all w-full text-left"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleNavClick(link.id);
                }}
              >
                <span className="text-base">{link.icon}</span>
                <span>{link.name}</span>
              </button>
            ))}
            <div className="pt-3 border-t">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onAdminClick();
                }}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium hover:bg-gradient-to-r hover:from-amber-50 hover:to-amber-100 rounded-xl transition-all w-full"
              >
                <span className="text-base">🛡️</span>
                <span>Admin Panel</span>
              </button>
            </div>
            <div className="pt-4">
              <button className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md">
                BOOK NOW
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}