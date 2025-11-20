// src/components/RecommendationGrid.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const dummyProducts = [
  {
    id: 1,
    image: '/images/sample-car1.jpg',
    title: '2016 Mercedes-Benz GLE Class 250d',
    price: '₹19,90,000',
    subtitle: '2016 · 95,000 km',
    location: 'Janakpuri, Delhi',
    date: 'Oct 22',
    featured: true,
  },
  {
    id: 2,
    image: '/images/sample-watch.jpg',
    title: 'Huawei Watch Fit 4 Pro',
    price: '₹14,500',
    subtitle: '',
    location: 'Ernakipalam, Kozhikode',
    date: 'Nov 04',
    featured: true,
  },
  {
    id: 3,
    image: '/images/sample-phone1.jpg',
    title: 'Samsung S24 Ultra',
    price: '₹65,000',
    subtitle: '',
    location: 'Samudrapur MIDC, Maharashtra',
    date: 'Today',
    featured: false,
  },
  {
    id: 4,
    image: '/images/sample-iphone13.jpg',
    title: 'iPhone 13 128Gb 11 month warranty',
    price: '₹21,000',
    subtitle: '',
    location: 'Samudrapur, Maharashtra',
    date: '5 Days Ago',
    featured: false,
  },
  {
    id: 5,
    image: '/images/sample-car2.jpg',
    title: '2016 · 120,000 km – Sell my S2 car',
    price: '₹7,50,000',
    subtitle: '',
    location: 'Samudrapur, Maharashtra',
    date: 'Yesterday',
    featured: false,
  },
  {
    id: 6,
    image: '/images/sample-car3.jpg',
    title: 'Mahindra Scorpio 2002 turbo Diesel W',
    price: '₹1,90,000',
    subtitle: '2002 · 226,000 km',
    location: 'Samudrapur, Maharashtra',
    date: 'Nov 10',
    featured: false,
  },
  {
    id: 7,
    image: '/images/sample-listing-generic.jpg',
    title: '1 Bds · 1 Ba – 30 ft² (Latest collection ultra simple)',
    price: '₹2,000',
    subtitle: '',
    location: 'Samudrapur, Maharashtra',
    date: 'Aug 13',
    featured: false,
  },
];

export default function RecommendationGrid() {
  return (
    <section className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6">Fresh recommendations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dummyProducts.map(prod => (
          <Link
            key={prod.id}
            to={`/product/${prod.id}`}
            className="relative border rounded-lg overflow-hidden bg-white hover:shadow-2xl transition-transform transform hover:-translate-y-2"
          >
            {prod.featured && (
              <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-semibold px-2 py-1 rounded">FEATURED</span>
            )}
            <img src={prod.image} alt={prod.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <p className="text-xl font-semibold text-blue-600">{prod.price}</p>
              <h3 className="mt-1 text-lg font-medium">{prod.title}</h3>
              {prod.subtitle && <p className="text-gray-500 mt-1">{prod.subtitle}</p>}
              <p className="mt-2 text-sm text-gray-600">{prod.location}</p>
              <p className="mt-1 text-xs text-gray-400">{prod.date}</p>
            </div>
            <button className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-100">
              {/* you could use an icon library here */}
              ♡
            </button>
          </Link>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link to="/buy" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          View All Listings
        </Link>
      </div>
    </section>
  );
}
