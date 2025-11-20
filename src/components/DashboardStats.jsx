import React from 'react';

export default function DashboardStats({ listings }) {
  const total = listings.length;
  const active = listings.filter(l => l.status === 'Active').length;
  const sold = listings.filter(l => l.status === 'Sold').length;
  const pending = listings.filter(l => l.status === 'Pending').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      <div className="p-4 bg-white rounded shadow">
        <p className="text-sm font-medium text-gray-500">Total Listings</p>
        <p className="text-2xl font-semibold">{total}</p>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <p className="text-sm font-medium text-gray-500">Active Listings</p>
        <p className="text-2xl font-semibold">{active}</p>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <p className="text-sm font-medium text-gray-500">Sold Listings</p>
        <p className="text-2xl font-semibold">{sold}</p>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <p className="text-sm font-medium text-gray-500">Pending Listings</p>
        <p className="text-2xl font-semibold">{pending}</p>
      </div>
    </div>
  );
}
