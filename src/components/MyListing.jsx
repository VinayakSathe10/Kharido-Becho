import React from 'react';

export default function MyListings({ listings }) {
  if (!listings || listings.length === 0) {
    return <p className="text-gray-600">No listings found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="px-4 py-2 border-b">ID</th>
            <th className="px-4 py-2 border-b">Title</th>
            <th className="px-4 py-2 border-b">Category</th>
            <th className="px-4 py-2 border-b">Price (₹)</th>
            <th className="px-4 py-2 border-b">Status</th>
            <th className="px-4 py-2 border-b">Listed At</th>
            <th className="px-4 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map(item => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{item.id}</td>
              <td className="px-4 py-2 border-b">{item.title}</td>
              <td className="px-4 py-2 border-b">{item.category} → {item.subCategory}</td>
              <td className="px-4 py-2 border-b">{item.price.toLocaleString()}</td>
              <td className="px-4 py-2 border-b">{item.status}</td>
              <td className="px-4 py-2 border-b">{item.createdAt}</td>
              <td className="px-4 py-2 border-b space-x-2">
                <button className="text-blue-600 hover:underline">Edit</button>
                <button className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
