// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import RecommendationGrid from "../../components/RecommendationGrid";

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gray-900 h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage:
              "url('/images/hero-vehicles-electronics.jpg')",
          }}
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg mb-4 animate-fadeIn">
            Buy & Sell Cars, Bikes, Mobiles & Laptops
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-6 animate-fadeIn delay-200">
            Your trusted marketplace for vehicles and electronics.
          </p>
          <div className="max-w-xl mx-auto flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="flex-1 p-3 rounded-l-md border-none outline-none"
            />
            <select className="p-3 border-none text-white outline-none">
              <option value="vehicles">Vehicles</option>
              <option value="electronics">Electronics</option>
            </select>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Fresh recommendations (now powered by live bikes) */}
      <RecommendationGrid />
    </div>
  );
}

