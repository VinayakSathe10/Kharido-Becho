// import React from "react";

// const STATUS_KEYS = ["ACTIVE", "PENDING", "SOLD"];

// const normalizeStatus = (status = "") => status.toString().toUpperCase();

// export default function DashboardStats({ listings = [] }) {
//   const counts = listings.reduce(
//     (acc, listing) => {
//       const normalized = normalizeStatus(listing.status);
//       if (STATUS_KEYS.includes(normalized)) {
//         acc[normalized] += 1;
//       }
//       return acc;
//     },
//     {
//       ACTIVE: 0,
//       PENDING: 0,
//       SOLD: 0,
//     }
//   );

//   const stats = [
//     { label: "Total Listings", value: listings.length },
//     { label: "Active Listings", value: counts.ACTIVE },
//     { label: "Pending Review", value: counts.PENDING },
//     { label: "Sold Items", value: counts.SOLD },
//   ];

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//       {stats.map((stat) => (
//         <div key={stat.label} className="p-4 bg-white rounded shadow">
//           <p className="text-sm font-medium text-gray-500">{stat.label}</p>
//           <p className="text-2xl font-semibold">{stat.value}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";

// COMPONENTS
import DashboardStats from "../../components/Dashboard/DashboardStats";
import CategoryTabs from "../../components/Dashboard/CategoryTabs";

import LaptopSection from "../../components/Dashboard/LaptopSection";
import BikeSection from "../../components/Dashboard/BikeSection";
import CarSection from "../../components/Dashboard/CarSection";
import MobileSection from "../../components/Dashboard/MobileSection";

export default function Dashboard() {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("LAPTOPS");

  // ✅ These states are required ONLY for stats
  const [laptops, setLaptops] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [cars, setCars] = useState([]);
  const [mobiles, setMobiles] = useState([]);

  /**
   * ✅ CALLBACKS FROM SECTIONS
   * Each section will report its loaded data back to dashboard
   */
  const handleLaptopData = (data) => setLaptops(data);
  const handleBikeData = (data) => setBikes(data);
  const handleCarData = (data) => setCars(data);
  const handleMobileData = (data) => setMobiles(data);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <button
          onClick={() => navigate("/sellfrom")}
          className="px-5 py-2 bg-green-600 text-white rounded-md"
        >
          + Sell Product
        </button>
      </div>

      {/* ✅ STATS (FIXED) */}
      <DashboardStats
        listings={
          activeCategory === "LAPTOPS"
            ? laptops
            : activeCategory === "BIKES"
            ? bikes
            : activeCategory === "CARS"
            ? cars
            : mobiles
        }
      />

      {/* CATEGORY TABS */}
      <CategoryTabs
        activeCategory={activeCategory}
        onChange={setActiveCategory}
      />

      {/* SECTIONS */}
      {activeCategory === "LAPTOPS" && (
        <LaptopSection onDataLoad={handleLaptopData} />
      )}

      {activeCategory === "BIKES" && (
        <BikeSection onDataLoad={handleBikeData} />
      )}

      {activeCategory === "CARS" && <CarSection onDataLoad={handleCarData} />}

      {activeCategory === "MOBILES" && (
        <MobileSection onDataLoad={handleMobileData} />
      )}
    </div>
  );
}
