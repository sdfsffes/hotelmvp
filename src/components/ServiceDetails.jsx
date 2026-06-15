// src/components/ServiceDetails.jsx - без дублирования Header и Hero
import { useState } from "react";
import ServiceCard from "./ServiceCard";
import { services } from "../data/services";

export default function ServiceDetails() {
  const [selectedService, setSelectedService] = useState(null);

  // Если услуга выбрана, показываем детали
  if (selectedService) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <button 
            onClick={() => setSelectedService(null)}
            className="mb-4 text-amber-600 hover:text-amber-700"
          >
            ← Back to services
          </button>
          <div className="text-6xl mb-4">{selectedService.icon}</div>
          <h1 className="text-3xl font-bold mb-2">{selectedService.title}</h1>
          <p className="text-gray-600 mb-4">{selectedService.fullDescription || selectedService.description}</p>
          <p className="text-2xl font-bold text-amber-600 mb-2">{selectedService.price}</p>
          <p className="text-gray-500">⏱ {selectedService.time || selectedService.duration}</p>
          <p className="text-gray-500">📍 {selectedService.location || "Hotel"}</p>
        </div>
      </div>
    );
  }

  // Показываем список услуг
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header и Hero теперь только здесь, один раз */}
      <header className="bg-white shadow-md py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-amber-600">Moven Pick Hotel</h1>
          <nav>
            <ul className="flex gap-6">
              <li><a href="/" className="hover:text-amber-600">Home</a></li>
              <li><a href="/services" className="hover:text-amber-600">Services</a></li>
              <li><a href="/contact" className="hover:text-amber-600">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="relative bg-gradient-to-r from-amber-700 to-orange-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Movenpick</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Choose from our wide range of premium services
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div 
              key={service.id} 
              onClick={() => setSelectedService(service)}
              className="cursor-pointer"
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}