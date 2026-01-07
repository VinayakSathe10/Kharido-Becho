// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAllLaptops } from "../../store/services/laptopServices";
// import { toast } from "react-toastify";
// import {
//   MdStar,
//   MdStarBorder,
//   MdMemory,
//   MdStorage,
//   MdCalendarToday,
//   MdLocalOffer,
// } from "react-icons/md";

// export default function BuyLaptops() {
//   const [laptops, setLaptops] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   // FETCH ALL LAPTOPS
//   const fetchLaptops = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const data = await getAllLaptops();
//       setLaptops(data);
//     } catch (err) {
//       setError("Failed to fetch laptops");
//       toast.error("Unable to load laptops. Please try again.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLaptops();
//   }, []);

//   // Format price
//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   // Generate rating stars
//   const renderRating = (rating = 4) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         i <= rating ? (
//           <MdStar key={i} className="text-yellow-500 text-sm" />
//         ) : (
//           <MdStarBorder key={i} className="text-gray-300 text-sm" />
//         )
//       );
//     }
//     return stars;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white py-8 px-4">
//         <div className="container mx-auto">
//           <h1 className="text-3xl md:text-4xl font-bold mb-3">
//             Browse Laptops
//           </h1>
//           <p className="text-lg text-blue-100">
//             Find pre-owned and new laptops with verified quality
//           </p>
//           <div className="mt-4 text-blue-100 text-sm bg-white/20 inline-block px-4 py-1 rounded-full">
//             {laptops.length} laptops available
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-8">
//         {/* Loading State */}
//         {loading && (
//           <div className="text-center py-12">
//             <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
//             <p className="text-gray-600 text-lg">Loading laptops...</p>
//           </div>
//         )}

//         {/* Error State */}
//         {error && !loading && (
//           <div className="text-center py-12">
//             <div className="text-red-500 text-5xl mb-4">⚠️</div>
//             <p className="text-gray-700 text-lg mb-3">{error}</p>
//             <button
//               onClick={fetchLaptops}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
//             >
//               Try Again
//             </button>
//           </div>
//         )}

//         {/* Empty State */}
//         {!loading && laptops.length === 0 && (
//           <div className="text-center py-12">
//             <div className="text-gray-400 text-6xl mb-4">💻</div>
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">
//               No laptops available
//             </h3>
//             <p className="text-gray-500">Check back later for new listings</p>
//           </div>
//         )}

//         {/* Laptops Grid */}
//         {!loading && laptops.length > 0 && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {laptops.map((lap) => {
//               const firstPhoto =
//                 lap?.laptopPhotos?.length > 0
//                   ? lap.laptopPhotos[0].photo_link
//                   : "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80";

//               return (
//                 <div
//                   key={lap.id}
//                   className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100"
//                   onClick={() => navigate(`/laptop/${lap.id}`)}
//                 >
//                   {/* Image Container */}
//                   <div className="relative h-48 overflow-hidden bg-gray-100">
//                     <img
//                       src={firstPhoto}
//                       alt={`${lap.brand} ${lap.model}`}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                     />
//                     {/* Condition Badge */}
//                     {lap.condition && (
//                       <div className="absolute top-3 left-3">
//                         <span
//                           className={`px-3 py-1 rounded-full text-xs font-medium ${
//                             lap.condition === "New"
//                               ? "bg-green-100 text-green-800"
//                               : "bg-blue-100 text-blue-800"
//                           }`}
//                         >
//                           {lap.condition}
//                         </span>
//                       </div>
//                     )}
//                   </div>

//                   {/* Content */}
//                   <div className="p-4">
//                     {/* Brand & Model */}
//                     <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">
//                       {lap.brand} {lap.model}
//                     </h3>

//                     {/* Specs */}
//                     <div className="space-y-2 mb-4">
//                       {lap.processor && (
//                         <div className="flex items-center text-gray-600 text-sm">
//                           <MdMemory className="mr-2 text-gray-400" />
//                           <span className="truncate">{lap.processor}</span>
//                         </div>
//                       )}

//                       {lap.ram && (
//                         <div className="flex items-center text-gray-600 text-sm">
//                           <MdMemory className="mr-2 text-gray-400" />
//                           <span>{lap.ram} RAM</span>
//                         </div>
//                       )}

//                       {lap.storage && (
//                         <div className="flex items-center text-gray-600 text-sm">
//                           <MdStorage className="mr-2 text-gray-400" />
//                           <span>{lap.storage}</span>
//                         </div>
//                       )}
//                     </div>

//                     {/* Price & Rating */}
//                     <div className="flex items-center justify-between pt-3 border-t border-gray-100">
//                       <div>
//                         <p className="text-2xl font-bold text-blue-600">
//                           {formatPrice(lap.price)}
//                         </p>
//                         {lap.originalPrice && (
//                           <p className="text-sm text-gray-500 line-through">
//                             {formatPrice(lap.originalPrice)}
//                           </p>
//                         )}
//                       </div>

//                       {/* Rating */}
//                       {/* <div className="flex items-center">
//                         {renderRating()}
//                         <span className="ml-1 text-sm text-gray-500">
//                           (4.0)
//                         </span>
//                       </div> */}
//                     </div>

//                     {/* View Button */}
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         navigate(`/laptop/${lap.id}`);
//                       }}
//                       className="mt-4 w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
//                     >
//                       View Details
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Stats Bar */}
//         {!loading && laptops.length > 0 && (
//           <div className="mt-10 pt-6 border-t border-gray-200">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
//               <div className="bg-white p-4 rounded-lg shadow-sm">
//                 <div className="text-2xl font-bold text-blue-600">
//                   {laptops.length}
//                 </div>
//                 <div className="text-gray-600 text-sm">Total Laptops</div>
//               </div>
//               <div className="bg-white p-4 rounded-lg shadow-sm">
//                 <div className="text-2xl font-bold text-blue-600">
//                   {Math.min(
//                     ...(laptops.map((l) => l.price) || [0])
//                   ).toLocaleString("en-IN")}
//                 </div>
//                 <div className="text-gray-600 text-sm">Lowest Price</div>
//               </div>
//               <div className="bg-white p-4 rounded-lg shadow-sm">
//                 <div className="text-2xl font-bold text-blue-600">
//                   {Math.max(
//                     ...(laptops.map((l) => l.price) || [0])
//                   ).toLocaleString("en-IN")}
//                 </div>
//                 <div className="text-gray-600 text-sm">Highest Price</div>
//               </div>
//               <div className="bg-white p-4 rounded-lg shadow-sm">
//                 <div className="text-2xl font-bold text-blue-600">
//                   {Math.round(
//                     laptops.reduce((sum, lap) => sum + lap.price, 0) /
//                       laptops.length || 0
//                   ).toLocaleString("en-IN")}
//                 </div>
//                 <div className="text-gray-600 text-sm">Average Price</div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




// src/pages/laptops/BuyLaptops.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllLaptops } from "../../store/services/laptopServices";
import LaptopCard from "../../components/Laptop/LaptopCard";

export default function BuyLaptops() {
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null);
  const [bookedLaptopIds, setBookedLaptopIds] = useState(() => new Set());

  useEffect(() => {
    loadLaptops();
  }, []);

  const loadLaptops = async () => {
    try {
      setLoading(true);
      const data = await getAllLaptops();
      setLaptops(data);
    } catch (err) {
      toast.error("Failed to load laptops.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (laptop) => {
    if (!laptop?.laptop_id && !laptop?.laptopId) return;

    const buyerId = Number(localStorage.getItem("buyerId"));

    if (!buyerId) {
      toast.error("Buyer ID not found. Please login again.");
      return;
    }

    const payload = {
      laptopId: laptop.laptop_id || laptop.laptopId,
      buyerId: buyerId,
      message: "Hi, I am interested in this laptop.",
    };

    setRequestingId(laptop.laptop_id || laptop.laptopId);

    try {
      const resp = await fetch("http://localhost:8087/laptops/bookings/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();

      if (!resp.ok) {
        const errorMessage = data.message || "Failed to send request";
        toast.error(errorMessage);

        if (errorMessage.includes("already created a booking")) {
          setBookedLaptopIds((prev) => {
            const next = new Set(prev);
            next.add(laptop.laptop_id || laptop.laptopId);
            return next;
          });
        }
        return;
      }

      toast.success("Request sent successfully!");

      setBookedLaptopIds((prev) => {
        const next = new Set(prev);
        next.add(laptop.laptop_id || laptop.laptopId);
        return next;
      });
    } catch (err) {
      toast.error("Network error while sending request.");
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-2">Laptops</h2>
      <p className="text-gray-600 mb-6">
        Find your next laptop from our listings.
      </p>

      {loading ? (
        <p>Loading laptops...</p>
      ) : laptops.length === 0 ? (
        <p>No laptops found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {laptops.map((laptop) => (
            <LaptopCard
              key={laptop.laptop_id || laptop.laptopId}
              laptop={laptop}
              onRequest={handleSendRequest}
              requesting={requestingId === (laptop.laptop_id || laptop.laptopId)}
              isBooked={bookedLaptopIds.has(laptop.laptop_id || laptop.laptopId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
