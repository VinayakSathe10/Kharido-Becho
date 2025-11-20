import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardStats from '../components/DashboardStats';
import MyListings from '../components/MyListing';

export default function Dashboard() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Replace with real API call for seller's listings
    const dummy = [
      { id: 1, category: 'vehicles', subCategory: 'cars', title: '2016 Honda City', price: 1250000, status: 'Active', createdAt: '2025-11-17' },
      { id: 2, category: 'electronics', subCategory: 'mobiles', title: 'iPhone 13 128Gb', price: 21000, status: 'Sold', createdAt: '2025-10-30' },
      { id: 3, category: 'vehicles', subCategory: 'bikes', title: 'Royal Enfield Classic 350', price: 180000, status: 'Pending', createdAt: '2025-11-01' },
    ];
    setTimeout(() => {
      setListings(dummy);
      setLoading(false);
    }, 500);
  }, []);

  const handleSellProduct = () => {
    navigate('/sellfrom');
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-12">Loading dashboard…</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Title and Sell Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleSellProduct}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Sell Product
        </button>
      </div>

      <DashboardStats listings={listings} />

      <div className="mt-8">
        <MyListings listings={listings} />
      </div>
    </div>
  );
}