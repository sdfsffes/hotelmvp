// src/components/AdminLogin.jsx
import { useState, useEffect } from "react";

export default function AdminLogin({ onSuccess, onClose }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  // Фоновые изображения для слайдера
  const backgrounds = [
    "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?w=1920&h=1080&fit=crop",
    "https://images.pexels.com/photos/2609221/pexels-photo-2609221.jpeg?w=1920&h=1080&fit=crop",
    "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?w=1920&h=1080&fit=crop",
    "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?w=1920&h=1080&fit=crop"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password.length !== 4) {
      setError("Password must be exactly 4 characters");
      return;
    }

    setIsLoading(true);
    setError("");

    setTimeout(() => {
      if (password === "9999") {
        onSuccess();
      } else {
        setError("Invalid password. Please try again.");
        setPassword("");
        setIsLoading(false);
      }
    }, 800);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setPassword(value);
      setError("");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-hidden">
      {/* Фоновый слайдер */}
      <div className="absolute inset-0 transition-all duration-1000">
        {backgrounds.map((bg, index) => (
          <div
            key={index}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${bg})`,
              opacity: index === bgIndex ? 1 : 0
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
      </div>

      {/* Анимированные декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-7xl text-amber-400/10 animate-float">✦</div>
        <div className="absolute bottom-10 right-10 text-7xl text-amber-400/10 animate-float-delayed">✦</div>
        <div className="absolute top-1/2 left-1/4 text-8xl text-white/5 animate-pulse-slow">★</div>
        <div className="absolute bottom-1/3 right-1/4 text-7xl text-white/5 animate-spin-slow">☀️</div>
        
        {/* Анимированные частицы */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-amber-400/20 rounded-full animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Форма входа */}
      <div className="relative z-10 w-full max-w-md animate-fadeInUp">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-white/20">
          {/* Логотип */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <span className="text-4xl font-serif font-bold text-white animate-bounce-slow">M</span>
              </div>
            </div>
            <h2 className="text-3xl font-serif font-bold text-white mt-6 tracking-wide">Admin Access</h2>
            <p className="text-white/60 text-sm mt-2">Enter your 4-digit password to continue</p>
          </div>

          {/* Форма */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Password (4 digits)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter 4-digit password"
                  maxLength="4"
                  className={`w-full px-6 py-4 bg-white/10 backdrop-blur-sm border-2 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all text-center text-2xl tracking-[12px] font-mono text-white placeholder-white/30 ${
                    error ? 'border-red-400 bg-red-500/10' : 'border-white/20 hover:border-white/40'
                  }`}
                  autoFocus
                />
                <div className="flex justify-center gap-3 mt-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        password.length >= i ? 'bg-amber-400 shadow-lg shadow-amber-400/50' : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>
              {error && (
                <p className="text-red-400 text-sm mt-3 flex items-center gap-2 animate-shake">
                  <span>⚠️</span>
                  <span>{error}</span>
                </p>
              )}
              <p className="text-white/30 text-xs mt-2 text-center">
                {password.length}/4 characters
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading || password.length !== 4}
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-700 text-white py-4 rounded-2xl font-medium hover:from-amber-600 hover:to-amber-800 transition-all duration-500 transform hover:scale-[1.02] shadow-lg hover:shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">⌘</span>
                    <span>Unlock Dashboard</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-4 bg-white/10 backdrop-blur-sm text-white/60 rounded-2xl font-medium hover:bg-white/20 transition-all duration-300 border border-white/10"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-center text-white/30 mt-4">
              Protected area. Authorized access only.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}