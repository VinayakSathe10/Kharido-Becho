// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import useSellerId from "../../pages/useSellerId";

// import {
//   getPendingBikeBookings,
//   rejectBikeBooking,
//   completeBikeBooking,
// } from "../../store/services/bikeBookingServices";

// const SellerBikeRequests = () => {
//   const { sellerId } = useSellerId();
//   const [pendingBikeBookings, setPendingBikeBookings] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [actionId, setActionId] = useState(null);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         if (!sellerId) return;
//         setLoading(true);

//         const bikeData = await getPendingBikeBookings();
//         const filtered = bikeData.filter(
//           (b) => b.sellerId === sellerId || b.bike?.sellerId === sellerId
//         );

//         setPendingBikeBookings(filtered);
//       } catch (err) {
//         toast.error("Failed to load bike requests");
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [sellerId]);

//   return (
//     <div className="mb-12">
//       <h2 className="text-xl font-semibold mb-3">Pending Bike Requests</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : pendingBikeBookings.length === 0 ? (
//         <p className="text-gray-400">No pending bike requests.</p>
//       ) : (
//         pendingBikeBookings.map((booking) => {
//           const bookingId = booking.id ?? booking.bikeBookingId;
//           return (
//             <div key={bookingId} className="bg-white p-4 rounded shadow mb-4">
//               <h3 className="font-semibold">
//                 {booking.bike?.brand} {booking.bike?.model}
//               </h3>
//               <p className="text-sm text-gray-600">
//                 Buyer: {booking.buyer?.user?.firstName}
//               </p>

//               <div className="flex gap-2 mt-3">
//                 <button
//                   className="px-3 py-1 border rounded"
//                   onClick={async () => {
//                     setActionId(bookingId);
//                     await rejectBikeBooking(bookingId);
//                     toast.success("Bike booking rejected");
//                     setPendingBikeBookings((prev) =>
//                       prev.filter(
//                         (b) => (b.id ?? b.bikeBookingId) !== bookingId
//                       )
//                     );
//                     setActionId(null);
//                   }}
//                 >
//                   Reject
//                 </button>

//                 <button
//                   className="px-3 py-1 bg-green-600 text-white rounded"
//                   onClick={async () => {
//                     setActionId(bookingId);
//                     await completeBikeBooking(bookingId);
//                     toast.success("Bike marked SOLD");
//                     setPendingBikeBookings((prev) =>
//                       prev.filter(
//                         (b) => (b.id ?? b.bikeBookingId) !== bookingId
//                       )
//                     );
//                     setActionId(null);
//                   }}
//                 >
//                   Mark Sold
//                 </button>
//               </div>
//             </div>
//           );
//         })
//       )}
//     </div>
//   );
// };

// export default SellerBikeRequests




import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getPendingBikeBookings } from "../../store/services/bikeBookingServices";

const SellerChatList = () => {
  const navigate = useNavigate();
  const sellerId = Number(localStorage.getItem("sellerId"));

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPending = async () => {
      try {
        setLoading(true);

        const data = await getPendingBikeBookings();

        const formatted = data.map((b) => ({
          bookingId: b.bookingId,
          title: `${b.bike?.brand || ""} ${b.bike?.model || ""}`,
          buyerName: `${b.buyer?.user?.firstName || ""} ${
            b.buyer?.user?.lastName || ""
          }`,
          status: b.status || b.bookingStatus || "PENDING",
        }));

        setChats(formatted);
      } catch (err) {
        console.error("Failed to load pending bike chats", err);
        toast.error("Failed to load pending bike chats");
      } finally {
        setLoading(false);
      }
    };

    loadPending();
  }, [sellerId]);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b px-4 py-3">
        <h1 className="text-xl font-bold">Pending Bike Requests</h1>
      </div>

      <div className="p-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : chats.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No pending bike requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((c) => (
              <div
                key={c.bookingId}
                onClick={() => navigate(`/seller/chat/${c.bookingId}`)}
                className="bg-white border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
              >
                <h2 className="font-semibold text-gray-900">{c.title}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Buyer: {c.buyerName}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Status: {c.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerChatList;

