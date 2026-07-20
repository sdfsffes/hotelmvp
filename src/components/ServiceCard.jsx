// src/components/ServiceCard.jsx
import { useState } from "react";
import ReviewsList from "./ReviewsList";

export default function ServiceCard({ service, onBookNow }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const categoryColors = {
    Dining: "from-amber-600 to-amber-800",
    Wellness: "from-emerald-600 to-teal-700",
    Adventure: "from-sky-600 to-blue-800",
    Activities: "from-purple-600 to-indigo-700",
    Family: "from-rose-500 to-pink-700"
  };
  
  const bgColor = categoryColors[service.category] || "from-amber-600 to-amber-800";
  const hasImage = service.image && !imageError;

  return (
    <div 
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Popular Badge */}
      {service.popular && (
        <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-amber-500 to-amber-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide uppercase">
          Most Popular
        </div>
      )}

      {/* Image Container */}
      <div className={`relative h-56 overflow-hidden ${hasImage ? 'bg-gray-200' : `bg-gradient-to-br ${bgColor}`}`}>
        {hasImage ? (
          <>
            <img 
              src={service.image} 
              alt={service.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              onError={() => setImageError(true)}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-7xl group-hover:scale-110 transition-transform duration-500">
              {service.icon}
            </span>
          </div>
        )}
        
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 border border-white/10">
          <span className="text-white text-[10px] font-mono font-bold tracking-wider">{service.code}</span>
        </div>
        
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 border border-white/10">
          <span className="text-white text-[10px] font-semibold uppercase tracking-wide">
            {service.category}
          </span>
        </div>

        <div className="absolute bottom-4 right-4 bg-amber-500/90 backdrop-blur-sm rounded-full px-3 py-1 border border-amber-400/30">
          <span className="text-white text-xs font-bold">฿{service.price}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-serif font-bold text-gray-800 group-hover:text-amber-700 transition-colors">
            {service.title}
          </h3>
          <div className="flex items-center gap-1 bg-gradient-to-r from-amber-50 to-orange-50 px-2 py-1 rounded-lg border border-amber-100/30">
            <span className="text-amber-500 text-xs">★</span>
            <span className="text-xs font-bold text-gray-700">{service.rating}</span>
            <span className="text-[9px] text-gray-400">({service.reviewsCount})</span>
          </div>
        </div>

        <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">
          {service.shortDescription}
        </p>

        <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
          <span>📍</span>
          <span>{service.location}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {service.options.slice(0, 3).map((option, idx) => (
            <span key={idx} className="text-[9px] bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 px-2 py-1 rounded-full border border-gray-200/50">
              {option}
            </span>
          ))}
          {service.options.length > 3 && (
            <span className="text-[9px] bg-gray-100 text-gray-400 px-2 py-1 rounded-full">
              +{service.options.length - 3}
            </span>
          )}
        </div>

        <button
          onClick={() => onBookNow(service)}
          className="relative w-full overflow-hidden group/btn bg-gradient-to-r from-amber-600 to-amber-800 text-white py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg tracking-wide"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <span>Reserve Experience</span>
            <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-900 transform translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
        </button>

        {/* Reviews - показываем только 1 */}
        <div className="mt-3">
          <ReviewsList serviceId={service.id} limit={1} />
        </div>
      </div>
    </div>
  );
}