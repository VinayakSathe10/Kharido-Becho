// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getBookingsForSeller } from "../../store/services/carBookingServices";

// const SellerChatList = () => {
//   const navigate = useNavigate();
//   const sellerId = Number(localStorage.getItem("sellerId"));

//   const [chats, setChats] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!sellerId) {
//       setChats([]);
//       setLoading(false);
//       return;
//     }

//     const loadChats = async () => {
//       try {
//         setLoading(true);
//         const data = await getBookingsForSeller(sellerId);
//         setChats(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Failed to load seller chats", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadChats();
//   }, [sellerId]);

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="bg-white border-b border-border px-4 py-3">
//         <h1 className="text-xl font-bold text-text-primary">Chats</h1>
//       </div>

//       <div className="p-4">
//         {loading ? (
//           <p className="text-center text-gray-500">Loading chats...</p>
//         ) : chats.length === 0 ? (
//           <div className="text-center py-12 text-text-tertiary">
//             <p>No chats yet</p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {chats.map((booking) => {
//               const car = booking.car || {};
//               const buyer = booking.buyer?.user || {};

//               return (
//                 <div
//                   key={booking.bookingId}
//                   onClick={() => navigate(`/seller/chat/${booking.bookingId}`)}
//                   className="bg-white border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
//                 >
//                   <h2 className="font-semibold text-gray-900">
//                     {car.title || `${car.brand} ${car.model}`}
//                   </h2>

//                   <p className="text-sm text-gray-600 mt-1">
//                     Buyer: {buyer.firstName} {buyer.lastName}
//                   </p>

//                   <p className="text-xs text-gray-500 mt-1">
//                     Status: {booking.bookingStatus}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SellerChatList;



// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// import { getBikeBookingsForSeller } from "../../store/services/bikeBookingServices";

// const SellerChatList = () => {
//   const navigate = useNavigate();
//   const sellerId = Number(localStorage.getItem("sellerId"));

//   const [chats, setChats] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!sellerId) {
//       setChats([]);
//       setLoading(false);
//       return;
//     }

//     const loadChats = async () => {
//       try {
//         setLoading(true);

//         const data = await getBikeBookingsForSeller(sellerId);

//         // 🔁 Normalize backend response
//         const formatted = data.map((b) => ({
//           bookingId: b.bookingId,
//           title: `${b.bike?.brand || ""} ${b.bike?.model || ""}`,
//           buyerName: `${b.buyer?.user?.firstName || ""} ${
//             b.buyer?.user?.lastName || ""
//           }`,
//           status: b.status || b.bookingStatus || "PENDING",
//         }));

//         setChats(formatted);
//       } catch (err) {
//         console.error("Failed to load bike seller chats", err);
//         toast.error("Failed to load bike chats");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadChats();
//   }, [sellerId]);

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <div className="bg-white border-b px-4 py-3">
//         <h1 className="text-xl font-bold">Bike Requests</h1>
//       </div>

//       {/* Content */}
//       <div className="p-4">
//         {loading ? (
//           <p className="text-center text-gray-500">Loading chats...</p>
//         ) : chats.length === 0 ? (
//           <div className="text-center py-12 text-gray-400">
//             <p>No bike requests yet</p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {chats.map((c) => (
//               <div
//                 key={c.bookingId}
//                 onClick={() =>
//                   navigate(`/seller/chat/${c.bookingId}`)
//                 }
//                 className="bg-white border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
//               >
//                 <h2 className="font-semibold text-gray-900">
//                   {c.title}
//                 </h2>

//                 <p className="text-sm text-gray-600 mt-1">
//                   Buyer: {c.buyerName || "Buyer"}
//                 </p>

//                 <p className="text-xs text-gray-500 mt-1">
//                   Status: {c.status}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SellerChatList;

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
