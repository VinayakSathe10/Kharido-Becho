// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { getAllBikes } from "../../store/services/bikeServices";
// import {
//   createBikeBooking,
//   getPendingBikeBookings,
// } from "../../store/services/bikeBookingServices";

// export default function BuyBikes() {
//   const [bikes, setBikes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [requestingId, setRequestingId] = useState(null);

//   // Maintain a Set of booked bike ids so we can show a persistent
//   // "Request Sent" badge and disable the booking button.
//   const [bookedBikeIds, setBookedBikeIds] = useState(() => {
//     try {
//       const raw = localStorage.getItem("bookedBikeIds");
//       if (!raw) return new Set();
//       const parsed = JSON.parse(raw);
//       return new Set(Array.isArray(parsed) ? parsed : []);
//     } catch {
//       return new Set();
//     }
//   });

//   // Persist bookedBikeIds in localStorage for reload persistence
//   useEffect(() => {
//     try {
//       const arr = Array.from(bookedBikeIds);
//       localStorage.setItem("bookedBikeIds", JSON.stringify(arr));
//     } catch {
//       // Ignore persistence errors
//     }
//   }, [bookedBikeIds]);

//   useEffect(() => {
//     loadBikes();
//     // Also pre-populate booked bikes from backend so that
//     // previously created bookings are respected after reload.
//     syncBookedBikesFromBackend();
//   }, []);

//   const loadBikes = async () => {
//     try {
//       setLoading(true);
//       const data = await getAllBikes();
//       setBikes(data);
//     } catch (err) {
//       console.error("Failed to load bikes", err);
//       toast.error("Failed to load bikes.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Ensure we treat server-side existing bookings as "booked"
//   // so buyers cannot spam multiple requests after reload.
//   const syncBookedBikesFromBackend = async () => {
//     try {
//       const buyerId =
//         Number(localStorage.getItem("buyerUserId")) ||
//         Number(localStorage.getItem("userId"));

//       if (!buyerId) return;

//       const allPending = await getPendingBikeBookings();
//       const buyerBookings = (allPending || []).filter((booking) => {
//         const bookingBuyerId =
//           booking.buyerId ||
//           booking.buyer?.id ||
//           booking.buyer?.buyerId ||
//           booking.buyer?.userId;
//         return Number(bookingBuyerId) === Number(buyerId);
//       });

//       if (!buyerBookings.length) return;

//       const bikeIdsFromBookings = buyerBookings
//         .map((b) => b.bikeId || b.bike?.bike_id || b.bike?.id)
//         .filter(Boolean);

//       if (!bikeIdsFromBookings.length) return;

//       setBookedBikeIds((prev) => {
//         const next = new Set(prev);
//         bikeIdsFromBookings.forEach((id) => next.add(id));
//         return next;
//       });
//     } catch (err) {
//       console.error("Failed to sync booked bikes from backend", err);
//       // Do not show a toast here to keep UX smooth
//     }
//   };

//   const handleSendRequest = async (bike) => {
//     if (!bike?.bike_id) return;

//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.info("Please login to send a request to the seller.");
//       return;
//     }

//     const buyerId =
//       Number(localStorage.getItem("buyerUserId")) ||
//       Number(localStorage.getItem("userId"));

//     if (!buyerId) {
//       toast.info("Buyer profile not found. Please login as buyer again.");
//       return;
//     }

//     try {
//       setRequestingId(bike.bike_id);
//       await createBikeBooking(
//         bike.bike_id,
//         buyerId,
//         "Hi, I am interested in this bike."
//       );

//       toast.success("Booking request sent to seller.");

//       // Mark this bike as booked in local state
//       setBookedBikeIds((prev) => {
//         const next = new Set(prev);
//         next.add(bike.bike_id);
//         return next;
//       });
//     } catch (err) {
//       console.error("Failed to send request", err);
//       const message =
//         err?.response?.data?.message ||
//         err?.message ||
//         "Failed to send booking request";

//       // Handle "already created" booking as a soft success
//       if (
//         typeof message === "string" &&
//         message.toLowerCase().includes("already created a booking")
//       ) {
//         // Do not show an error toast; just treat as success and update UI.
//         setBookedBikeIds((prev) => {
//           const next = new Set(prev);
//           next.add(bike.bike_id);
//           return next;
//         });
//       } else {
//         toast.error(message);
//       }
//     } finally {
//       setRequestingId(null);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* PAGE HEADER */}
//       <h2 className="text-3xl font-bold mb-2">Browse Bikes</h2>
//       <p className="text-gray-600 mb-6">
//         Find your next bike from our wide selection of listings.
//       </p>

//       {loading ? (
//         <p className="text-gray-700 text-lg">Loading bikes...</p>
//       ) : bikes.length === 0 ? (
//         <p className="text-gray-600">No bikes found.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {bikes.map((bike) => (
//             <BikeCard
//               key={bike.bike_id}
//               bike={bike}
//               onRequest={handleSendRequest}
//               requesting={requestingId === bike.bike_id}
//               // Use the bookedBikeIds Set to drive badge and button state
//               isBooked={bookedBikeIds.has(bike.bike_id)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// /* -------------------------
//         BIKE CARD UI
// -------------------------- */
// function BikeCard({ bike, onRequest, requesting, isBooked }) {
//   // Handle image — your backend returns a list of images: bike.images[]
//   const imageUrl =
//     bike.images?.[0]?.image_link ||
//     "https://via.placeholder.com/300x200?text=No+Image";

//   const normalizedStatus = (bike.status || "").toString().toUpperCase();
//   const isPending = normalizedStatus === "PENDING";
//   const isSold = normalizedStatus === "SOLD";

//   const isRequestDisabled = requesting || isPending || isSold || isBooked;

//   return (
//     <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-3">
//       {/* IMAGE */}
//       <div className="w-full h-44 overflow-hidden rounded-md relative">
//         <img
//           src={imageUrl}
//           alt={bike.brand}
//           className="w-full h-full object-cover"
//         />

//         {/* Request Sent badge (top-most) */}
//         {isBooked && !isSold && (
//           <span className="absolute top-2 left-2 z-20 inline-flex items-center px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-semibold shadow-sm">
//             Request Sent
//           </span>
//         )}

//         {/* Existing status badges (rendered below the request badge) */}
//         {(isPending || isSold) && (
//           <span
//             className={`absolute ${isBooked && !isSold ? "top-8" : "top-2"} left-2 text-xs font-semibold px-2 py-1 rounded ${
//               isSold ? "bg-red-600 text-white" : "bg-yellow-400 text-gray-900"
//             }`}
//           >
//             {isSold ? "Sold" : "Pending"}
//           </span>
//         )}
//       </div>

//       {/* DETAILS */}
//       <div className="mt-3 space-y-1">
//         <h3 className="text-lg font-semibold">
//           {bike.brand} {bike.model}
//         </h3>

//         <p className="text-gray-600 text-sm">
//           Variant: <span className="font-medium">{bike.variant}</span>
//         </p>

//         <p className="text-gray-600 text-sm">
//           Year: <span className="font-medium">{bike.manufactureYear}</span>
//         </p>

//         <p className="text-green-600 font-bold text-lg">
//           ₹ {bike.prize?.toLocaleString()}
//         </p>
//       </div>

//       {/* BUTTON */}
//       <button
//         className="w-full mt-3 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:opacity-60"
//         onClick={() => onRequest?.(bike)}
//         disabled={isRequestDisabled}
//       >
//         {isSold
//           ? "Sold"
//           : isPending
//           ? "Request Pending"
//           : isBooked
//           ? "Request Already Sent"
//           : requesting
//           ? "Sending Request..."
//           : "Send Request to Seller"}
//       </button>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllBikes } from "../../store/services/bikeServices";
import { createBikeBooking } from "../../store/services/bikeBookingServices";

export default function BuyBikes() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null);
  const [bookedBikeIds, setBookedBikeIds] = useState(() => new Set());

  useEffect(() => {
    loadBikes();
  }, []);

  const loadBikes = async () => {
    try {
      setLoading(true);
      const data = await getAllBikes();
      setBikes(data);
    } catch (err) {
      console.error("Failed to load bikes", err);
      toast.error("Failed to load bikes.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (bike) => {
    if (!bike?.bike_id) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please login to send a request to the seller.");
      return;
    }

    // ⭐ FIXED BUYER ID (Corrected)
    const buyerId =
      Number(localStorage.getItem("buyerUserId")) ||
      Number(localStorage.getItem("userId")) ||
      Number(localStorage.getItem("buyerId"));

    if (!buyerId) {
      toast.info("Buyer profile not found. Please login again.");
      return;
    }

    try {
      setRequestingId(bike.bike_id);

      await createBikeBooking(
        bike.bike_id,
        buyerId,
        "Hi, I am interested in this bike."
      );

      toast.success("Booking request sent successfully.");

      setBookedBikeIds((prev) => new Set(prev).add(bike.bike_id));
    } catch (err) {
      console.error("Booking Error:", err);

      const msg = err?.response?.data?.message || err?.message || "";

      if (msg.toLowerCase().includes("already created a booking")) {
        toast.info("You already created a booking for this bike.");
        setBookedBikeIds((prev) => new Set(prev).add(bike.bike_id));
        return;
      }

      toast.error(msg);
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-2">Browse Bikes</h2>
      <p className="text-gray-600 mb-6">
        Find your next bike from our wide selection of listings.
      </p>

      {loading ? (
        <p className="text-gray-700 text-lg">Loading bikes...</p>
      ) : bikes.length === 0 ? (
        <p className="text-gray-600">No bikes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bikes.map((bike) => (
            <BikeCard
              key={bike.bike_id}
              bike={bike}
              onRequest={handleSendRequest}
              requesting={requestingId === bike.bike_id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------
        BIKE CARD UI
-------------------------- */
function BikeCard({ bike, onRequest, requesting }) {
  const imageUrl =
    bike.images?.[0]?.image_link ||
    "https://via.placeholder.com/300x200?text=No+Image";

  const normalizedStatus = (bike.status || "").toString().toUpperCase();
  const isPending = normalizedStatus === "PENDING";
  const isSold = normalizedStatus === "SOLD";

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-3">
      <div className="w-full h-44 overflow-hidden rounded-md relative">
        <img
          src={imageUrl}
          alt={bike.brand}
          className="w-full h-full object-cover"
        />

        {(isPending || isSold) && (
          <span
            className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded ${
              isSold ? "bg-red-600 text-white" : "bg-yellow-400 text-gray-900"
            }`}
          >
            {isSold ? "Sold" : "Pending"}
          </span>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="text-lg font-semibold">
          {bike.brand} {bike.model}
        </h3>

        <p className="text-gray-600 text-sm">
          Variant: <span className="font-medium">{bike.variant}</span>
        </p>

        <p className="text-gray-600 text-sm">
          Year: <span className="font-medium">{bike.manufactureYear}</span>
        </p>

        <p className="text-green-600 font-bold text-lg">
          ₹ {bike.prize?.toLocaleString()}
        </p>
      </div>

      <button
        className="w-full mt-3 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:opacity-60"
        onClick={() => onRequest?.(bike)}
        disabled={requesting || isPending || isSold}
      >
        {isSold
          ? "Sold"
          : isPending
          ? "Request Pending"
          : requesting
          ? "Sending Request..."
          : "Send Request to Seller"}
      </button>
    </div>
  );
}
