import React, { useEffect, useState } from "react";
import { getAllLaptops } from "../../store/services/laptopServices"; // adjust path if needed
 
export default function BuyLaptops() {
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 
  const fetchLaptops = async () => {
    setLoading(true);
    setError("");
 
    try {
      const data = await getAllLaptops();
      setLaptops(data);
    } catch (err) {
      setError("Failed to fetch laptops");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchLaptops();
  }, []);
 
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Browse Laptops</h2>
      <p className="text-gray-600 mb-4">
        Check out pre-owned & new laptops across brands and specs.
      </p>
 
      {/* LOADING */}
      {loading && <p className="text-blue-500 text-lg">Loading laptops...</p>}
 
      {/* ERROR */}
      {error && <p className="text-red-500">{error}</p>}
 
      {/* EMPTY */}
      {!loading && laptops.length === 0 && (
        <p className="text-gray-500">No laptops found.</p>
      )}
 
      {/* LAPTOP GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {laptops.map((lap) => {
          const firstPhoto =
            lap?.laptopPhotos?.length > 0
              ? lap.laptopPhotos[0].photo_link // <-- correct field
              : "https://via.placeholder.com/300x200"; // fallback image
 
          return (
            <div
              key={lap.id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition"
            >
              <img
                src={firstPhoto}
                alt={lap.model}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
 
              <h3 className="text-lg font-semibold">
                {lap.brand} {lap.model}
              </h3>
 
              <p className="text-gray-600 text-sm mt-1">
                Processor: <span className="font-medium">{lap.processor}</span>
              </p>
 
              <p className="text-gray-600 text-sm">
                Warranty: {lap.warrantyInYear} year(s)
              </p>
 
              <p className="text-gray-900 font-bold text-xl mt-3">
                ₹ {lap.price}
              </p>
 
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                View Details
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}