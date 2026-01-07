// src/components/RecommendationGrid.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllBikes } from "../store/services/bikeServices";
import { getAllCars } from "../store/services/carServices";
import { getAllMobiles } from "../store/services/mobileServices";

export default function RecommendationGrid() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        // Fetch 4 of each to create a mix
        const [bikesData, carsData, mobilesData] = await Promise.all([
          getAllBikes().catch(() => []),
          getAllCars(0, 4).catch(() => []),
          getAllMobiles(0, 4).catch(() => []),
        ]);

        if (!isMounted) return;

        // --- NORMALIZE BIKES ---
        const normalizedBikes = (bikesData || []).slice(0, 4).map((bike) => ({
          id: bike.bike_id,
          type: "bike",
          image: bike.images?.[0]?.image_link || "https://via.placeholder.com/350x230?text=No+Image",
          title: `${bike.brand} ${bike.model}`,
          price: bike.prize, // Note: 'prize' is used in bike data
          subtitle: `${bike.manufactureYear || "N/A"} • ${bike.kilometersDriven ? bike.kilometersDriven + " km" : "N/A"}`,
          link: `/buy/bikes/${bike.bike_id}`,
        }));

        // --- NORMALIZE CARS ---
        // Cars data usually comes as { content: [...] } or [...] depending on API response structure, 
        // but our service returns .content || [].
        const normalizedCars = (carsData || []).map((car) => {
          // Helper to get car image
          let imgUrl = "https://via.placeholder.com/350x230?text=No+Image";
          if (Array.isArray(car.images) && car.images.length > 0) {
            const first = car.images[0];
            imgUrl = typeof first === "string" ? first : (first.imageUrl || first.url || imgUrl);
          } else if (car.image) {
            imgUrl = car.image;
          }

          // Use title or brand+model
          const title = car.title || `${car.brand} ${car.model}`;

          return {
            id: car.carId || car._id || car.id,
            type: "car",
            image: imgUrl,
            title: title,
            price: car.price,
            subtitle: `${car.yearOfPurchase || car.manufactureYear || "N/A"} • ${car.fuelType || "Fuel N/A"}`,
            link: `/buy/cars/${car.carId || car._id || car.id}`,
          };
        });

        // --- NORMALIZE MOBILES ---
        const normalizedMobiles = (mobilesData || []).map((mobile) => ({
          id: mobile.mobileId || mobile.id,
          type: "mobile",
          image: mobile.images?.[0] || "https://via.placeholder.com/350x230?text=No+Image",
          title: `${mobile.brand} ${mobile.model}`,
          price: mobile.price,
          subtitle: `Condition: ${mobile.condition || "N/A"}`,
          link: `/buy/mobiles/${mobile.id || mobile.mobileId}`,  // Assuming this route exists or matches pattern
        }));

        // Combine and set
        setItems([...normalizedBikes, ...normalizedCars, ...normalizedMobiles]);

      } catch (err) {
        console.error("Failed to load recommendations", err);
        if (!isMounted) return;
        setItems([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6">Fresh Recommendations</h2>

      {loading ? (
        <p className="text-gray-600">Loading recommendations...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">No items available right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <Link
              to={item.link}
              key={`${item.type}-${item.id}-${index}`}
              className="relative border rounded-lg overflow-hidden bg-white hover:shadow-2xl transition-transform transform hover:-translate-y-2 block"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-xl font-semibold text-blue-600">
                  ₹ {Number(item.price || 0).toLocaleString()}
                </p>
                <h3 className="mt-1 text-lg font-medium truncate" title={item.title}>
                  {item.title}
                </h3>
                <p className="text-gray-500 mt-1 text-sm truncate">
                  {item.subtitle}
                </p>
              </div>
              <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow text-xs">
                ♡
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        {/* <Link
          to="/buy/bikes"
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          View All Bikes
        </Link> */}
      </div>
    </section>
  );
}
