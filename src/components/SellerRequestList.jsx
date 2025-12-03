// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";

// import useSellerId from "../hooks/useSellerId";
// import {
//   getPendingBikeBookings,
//   rejectBikeBooking,
//   completeBikeBooking,
// } from "../store/services/bikeBookingServices";

// const SellerRequestListScreen = () => {
//   const { sellerId, loading: sellerLoading, error: sellerError } = useSellerId();
//   const [pendingBookings, setPendingBookings] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [actionId, setActionId] = useState(null);

//   useEffect(() => {
//     if (!sellerId) return;

//     const load = async () => {
//       try {
//         setLoading(true);
//         const data = await getPendingBikeBookings();
//         const list = Array.isArray(data) ? data : [];
//         // Filter bookings for this seller only, if sellerId is present in booking
//         const filtered = list.filter(
//           (booking) =>
//             !sellerId ||
//             booking.sellerId === sellerId ||
//             booking.bike?.sellerId === sellerId
//         );
//         setPendingBookings(filtered);
//       } catch (err) {
//         console.error("Failed to load pending bike bookings", err);
//         toast.error("Failed to load buyer requests.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [sellerId]);

//   const handleReject = async (booking) => {
//     const bookingId = booking?.id || booking?.bikeBookingId || booking?.bookingId;
//     if (!bookingId) return;

//     try {
//       setActionId(bookingId);
//       await rejectBikeBooking(bookingId);
//       toast.success("Booking rejected successfully.");
//       setPendingBookings((prev) =>
//         prev.filter(
//           (b) =>
//             (b.id ?? b.bikeBookingId ?? b.bookingId) !== bookingId
//         )
//       );
//     } catch (err) {
//       console.error("Failed to reject booking", err);
//       toast.error(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Failed to reject booking"
//       );
//     } finally {
//       setActionId(null);
//     }
//   };

//   const handleComplete = async (booking) => {
//     const bookingId = booking?.id || booking?.bikeBookingId || booking?.bookingId;
//     if (!bookingId) return;

//     try {
//       setActionId(bookingId);
//       await completeBikeBooking(bookingId);
//       toast.success("Booking marked as SOLD successfully.");
//       setPendingBookings((prev) =>
//         prev.filter(
//           (b) =>
//             (b.id ?? b.bikeBookingId ?? b.bookingId) !== bookingId
//         )
//       );
//     } catch (err) {
//       console.error("Failed to complete booking", err);
//       toast.error(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Failed to complete booking"
//       );
//     } finally {
//       setActionId(null);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="bg-white border-b px-4 py-3">
//         <h1 className="text-xl font-bold text-gray-900">Buyer Requests</h1>
//         {sellerLoading && (
//           <p className="text-xs text-gray-500 mt-1">
//             Resolving seller profile…
//           </p>
//         )}
//         {sellerError && !sellerLoading && (
//           <p className="text-xs text-red-600 mt-1">{sellerError}</p>
//         )}
//       </div>

//       <div className="p-4">
//         {loading ? (
//           <div className="text-center py-12 text-gray-500">
//             <p>Loading buyer requests…</p>
//           </div>
//         ) : pendingBookings.length === 0 ? (
//           <div className="text-center py-12 text-gray-400">
//             <p>No pending buyer requests for your bikes.</p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {pendingBookings.map((booking) => {
//               const bike = booking.bike || {};
//               const bookingId =
//                 booking.id ?? booking.bikeBookingId ?? booking.bookingId;
//               const buyerName =
//                 booking.buyer?.user
//                   ? `${booking.buyer.user.firstName} ${booking.buyer.user.lastName}`
//                   : booking.buyer?.user?.email || "Buyer";

//               return (
//               <div
//                 key={bookingId}
//                 className="bg-white rounded-lg shadow-sm border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
//               >
//                 <div>
//                   <h2 className="text-sm font-semibold text-gray-900">
//                     {bike.brand} {bike.model} ({bike.variant})
//                   </h2>
//                   <p className="text-xs text-gray-500 mt-1">
//                     Year: {bike.manufactureYear || "N/A"} • Price: ₹{" "}
//                     {bike.prize?.toLocaleString()}
//                   </p>
//                   <p className="text-xs text-gray-500 mt-1">
//                     Buyer: {buyerName}
//                   </p>
//                   <p className="text-xs text-yellow-700 mt-1">
//                     Status: Pending request from buyer
//                   </p>
//                 </div>

//                 <div className="flex gap-2 justify-end">
//                   <button
//                     type="button"
//                     className="px-3 py-1.5 rounded-md border text-xs md:text-sm border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-60"
//                     disabled={actionId === bookingId}
//                     onClick={() => handleReject(booking)}
//                   >
//                     {actionId === bookingId ? "Updating…" : "Reject / Cancel"}
//                   </button>
//                   <button
//                     type="button"
//                     className="px-3 py-1.5 rounded-md bg-green-600 text-white text-xs md:text-sm hover:bg-green-700 disabled:opacity-60"
//                     disabled={actionId === bookingId}
//                     onClick={() => handleComplete(booking)}
//                   >
//                     {actionId === bookingId ? "Updating…" : "Accept & Mark Sold"}
//                   </button>
//                 </div>
//               </div>
//             )})}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SellerRequestListScreen;

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import useSellerId from "../hooks/useSellerId";

import {
  getPendingBikeBookings,
  rejectBikeBooking,
  completeBikeBooking,
} from "../store/services/bikeBookingServices";

import {
  getLaptopBookingByBuyer,
  getLaptopBookingById,
  updateLaptopBookingStatus,
  completeLaptopBooking,
} from "../store/services/laptopBookingServices";

const SellerRequestListScreen = () => {
  const {
    sellerId,
    loading: sellerLoading,
    error: sellerError,
  } = useSellerId();

  const buyerId = Number(localStorage.getItem("buyerId"));
  const sellerUserId = Number(localStorage.getItem("userId"));

  const [pendingBikeBookings, setPendingBikeBookings] = useState([]);
  const [buyerLaptopBookings, setBuyerLaptopBookings] = useState([]);
  const [sellerLaptopBookings, setSellerLaptopBookings] = useState([]);

  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState(null);

  // ============================
  // LOAD ALL THREE DATA SOURCES
  // ============================
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // 1️⃣ Load Bike Pending (Seller)
        if (sellerId) {
          const bikeData = await getPendingBikeBookings();
          const filtered = bikeData.filter(
            (b) => b.sellerId === sellerId || b.bike?.sellerId === sellerId
          );
          setPendingBikeBookings(filtered);
        }

        // 2️⃣ Load Laptop Bookings (Buyer)
        if (buyerId) {
          const data = await getLaptopBookingByBuyer(buyerId);
          setBuyerLaptopBookings(Array.isArray(data) ? data : [data]);
        }

        // 3️⃣ Load Laptop Bookings (Seller)
        // Strategy: Loop buyer bookings, filter those where sellerId = current seller
        if (sellerId) {
          let sellerRequestList = [];

          const requestIds = buyerLaptopBookings.map(
            (booking) => booking.laptopBookingId
          );

          for (let id of requestIds) {
            const record = await getLaptopBookingById(id);
            if (record.sellerId === sellerId) {
              sellerRequestList.push(record);
            }
          }

          setSellerLaptopBookings(sellerRequestList);
        }
      } catch (err) {
        toast.error("Error loading requests");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [sellerId, buyerId]);

  // ============================================
  // SELLER ACTIONS FOR LAPTOP BOOKINGS
  // ============================================
  const handleLaptopAccept = async (bookingId) => {
    try {
      setActionId(bookingId);
      await updateLaptopBookingStatus(bookingId, "ACCEPTED");
      toast.success("Laptop booking accepted");

      setSellerLaptopBookings((prev) =>
        prev.map((b) =>
          b.laptopBookingId === bookingId ? { ...b, status: "ACCEPTED" } : b
        )
      );
    } catch (err) {
      toast.error("Failed to accept laptop booking");
      console.error(err);
    } finally {
      setActionId(null);
    }
  };

  const handleLaptopComplete = async (bookingId) => {
    try {
      setActionId(bookingId);
      await completeLaptopBooking(bookingId);
      toast.success("Laptop marked as SOLD");

      setSellerLaptopBookings((prev) =>
        prev.filter((b) => b.laptopBookingId !== bookingId)
      );
    } catch (err) {
      toast.error("Failed to mark laptop as sold");
      console.error(err);
    } finally {
      setActionId(null);
    }
  };

  // ============================================
  // SELLER BIKE ACTIONS
  // ============================================
  const handleRejectBike = async (booking) => {
    const bookingId = booking?.id ?? booking?.bikeBookingId;
    try {
      setActionId(bookingId);
      await rejectBikeBooking(bookingId);
      toast.success("Bike booking rejected");

      setPendingBikeBookings((prev) =>
        prev.filter((b) => (b.id ?? b.bikeBookingId) !== bookingId)
      );
    } catch (err) {
      toast.error("Error rejecting bike booking");
    } finally {
      setActionId(null);
    }
  };

  const handleCompleteBike = async (booking) => {
    const bookingId = booking?.id ?? booking?.bikeBookingId;
    try {
      setActionId(bookingId);
      await completeBikeBooking(bookingId);
      toast.success("Bike marked Sold");

      setPendingBikeBookings((prev) =>
        prev.filter((b) => (b.id ?? b.bikeBookingId) !== bookingId)
      );
    } catch (err) {
      toast.error("Error completing bike booking");
    } finally {
      setActionId(null);
    }
  };

  // ============================================
  // UI
  // ============================================
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">All Buyer & Seller Requests</h1>

      {loading && <p className="text-gray-500">Loading...</p>}

      {/* ========================
          1️⃣ SELLER - BIKE 
      ======================== */}
      <h2 className="text-xl font-semibold mb-3">
        Pending Bike Requests (Seller)
      </h2>

      {pendingBikeBookings.length === 0 ? (
        <p className="text-gray-400 mb-6">No pending bike requests.</p>
      ) : (
        pendingBikeBookings.map((booking) => (
          <div
            key={booking.id ?? booking.bikeBookingId}
            className="bg-white p-4 rounded shadow mb-4"
          >
            <h3 className="font-semibold">
              {booking.bike?.brand} {booking.bike?.model}
            </h3>
            <p className="text-sm text-gray-600">
              Buyer: {booking.buyer?.user?.firstName}
            </p>

            <div className="flex gap-2 mt-3">
              <button
                className="px-3 py-1 border rounded"
                onClick={() => handleRejectBike(booking)}
              >
                Reject
              </button>

              <button
                className="px-3 py-1 bg-green-600 text-white rounded"
                onClick={() => handleCompleteBike(booking)}
              >
                Mark Sold
              </button>
            </div>
          </div>
        ))
      )}

      <hr className="my-8" />

      {/* ========================
          2️⃣ BUYER - LAPTOP 
      ======================== */}
      <h2 className="text-xl font-semibold mb-3">Laptop Requests (Buyer)</h2>

      {!buyerId ? (
        <p className="text-gray-400">Login as buyer to view laptop requests.</p>
      ) : buyerLaptopBookings.length === 0 ? (
        <p className="text-gray-400">No laptop booking requests.</p>
      ) : (
        buyerLaptopBookings.map((booking) => (
          <div
            key={booking.laptopBookingId}
            className="bg-white p-4 rounded shadow mb-4"
          >
            <h3 className="font-semibold">Laptop ID: {booking.laptopId}</h3>
            <p className="text-sm">Status: {booking.status}</p>
            <p className="text-sm">Booking Date: {booking.bookingDate}</p>
          </div>
        ))
      )}

      <hr className="my-8" />

      {/* ========================
          3️⃣ SELLER - LAPTOP 
      ======================== */}
      <h2 className="text-xl font-semibold mb-3">Laptop Requests (Seller)</h2>

      {sellerLaptopBookings.length === 0 ? (
        <p className="text-gray-400">No laptop booking requests.</p>
      ) : (
        sellerLaptopBookings.map((booking) => (
          <div
            key={booking.laptopBookingId}
            className="bg-white p-4 rounded shadow mb-4"
          >
            <h3 className="font-semibold">
              Laptop Request #{booking.laptopBookingId}
            </h3>
            <p className="text-sm">Laptop ID: {booking.laptopId}</p>
            <p className="text-sm">Status: {booking.status}</p>

            <div className="flex gap-2 mt-3">
              <button
                className="px-3 py-1 border rounded"
                onClick={() => handleLaptopAccept(booking.laptopBookingId)}
              >
                Accept
              </button>

              <button
                className="px-3 py-1 bg-green-600 text-white rounded"
                onClick={() => handleLaptopComplete(booking.laptopBookingId)}
              >
                Mark Sold
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SellerRequestListScreen;
