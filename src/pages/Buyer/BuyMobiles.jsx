import React, { useEffect, useState } from "react";
import { getAllMobiles } from "../../store/services/mobileServices";

export default function BuyMobiles() {
  const [mobiles, setMobiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMobiles();
  }, []);

  const loadMobiles = async () => {
    try {
      setLoading(true);

      const data = await getAllMobiles(0, 100); // returns data.content
      setMobiles(data);
    } catch (err) {
      console.error("Failed to load mobiles", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* TITLE */}
      <h2 className="text-3xl font-bold mb-2">Browse Mobiles</h2>
      <p className="text-gray-600 mb-6">
        Find your next smartphone from verified sellers.
      </p>

      {loading ? (
        <p className="text-gray-700 text-lg">Loading mobiles...</p>
      ) : mobiles.length === 0 ? (
        <p className="text-gray-600">No mobiles available right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mobiles.map((mobile) => (
            <MobileCard key={mobile.mobileId} mobile={mobile} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------
                  MOBILE CARD COMPONENT
----------------------------------------------------- */

function MobileCard({ mobile }) {
  const imageUrl =
    mobile.images?.[0] || "https://via.placeholder.com/350x230?text=No+Image";

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-3">
      {/* IMAGE */}
      <div className="w-full h-44 rounded-md overflow-hidden">
        <img
          src={imageUrl}
          alt={mobile.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* DETAILS */}
      <div className="mt-3 space-y-1">
        <h3 className="text-lg font-semibold">
          {mobile.brand} {mobile.model}
        </h3>

        <p className="text-gray-600 text-sm">
          {mobile.yearOfPurchase
            ? `Purchased: ${mobile.yearOfPurchase}`
            : "Year N/A"}
        </p>

        <p className="text-gray-600 text-sm">Condition: {mobile.condition}</p>

        <p className="text-green-600 font-bold text-lg">
          ₹ {Number(mobile.price).toLocaleString()}
        </p>
      </div>

      {/* BUTTON */}
      <button
        className="w-full mt-3 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
        onClick={() => alert("Mobile details page coming soon")}
      >
        View Details
      </button>
    </div>
  );
}
