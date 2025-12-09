// // src/components/SellerRequestList.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { getPendingBikeBookings } from "../store/services/bikeBookingServices";

// export default function SellerRequestList() {
//   const [bookings, setBookings] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     loadBookings();
//   }, []);

//   const loadBookings = async () => {
//     try {
//       const data = await getPendingBikeBookings();
//       setBookings(Array.isArray(data) ? data : [data]);
//     } catch (err) {
//       console.error("Error loading bookings:", err);
//       toast.error("Failed to load requests");
//     }
//   };

//   const handleChat = (booking) => {
//     const bookingId = booking?.id;
//     const bikeId = booking?.bike?.bike_id;
//     const buyerId = booking?.buyer?.buyerId ?? booking?.buyer?.user?.id;
//     const sellerId = booking?.bike?.sellerId;

//     if (!bookingId || !bikeId || !buyerId || !sellerId) {
//       console.log("Booking data incomplete:", booking);
//       toast.error("Cannot open chat — incomplete booking data");
//       return;
//     }

//     navigate(`/chat?bookingId=${bookingId}&bike=${bikeId}&buyer=${buyerId}&seller=${sellerId}`);
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-3">Pending Bike Requests</h2>
//       {bookings.length === 0 && <p>No pending requests</p>}
//       {bookings.map((b) => {
//         const bikeName = `${b.bike?.brand || ""} ${b.bike?.model || ""}`;
//         const buyerName = b.buyer?.user?.firstName ?? "Unknown Buyer";
//         return (
//           <div key={b.id} className="border p-3 rounded mb-2 flex justify-between items-center">
//             <div>
//               <p><b>Bike:</b> {bikeName}</p>
//               <p><b>Buyer:</b> {buyerName}</p>
//               <p><b>Status:</b> {b.status}</p>
//             </div>
//             <button
//               className="bg-blue-600 text-white px-3 py-1 rounded"
//               onClick={() => handleChat(b)}
//             >
//               Chat / Negotiate
//             </button>
//           </div>
//         );
//       })}
//     </div>
//   );
// }


// src/components/SellerRequestList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getPendingBikeBookings } from "../store/services/bikeBookingServices";

export default function SellerRequestList() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  // TODO: replace this with actual logged-in seller id from auth context / localStorage
  const loggedInSellerId = Number(localStorage.getItem("userId")) || null;

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await getPendingBikeBookings();
      setBookings(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Error loading bookings:", err);
      toast.error("Failed to load requests");
    }
  };

  const handleChat = (booking) => {
    const bookingId = booking?.id;
    const bikeId = booking?.bike?.bike_id;
    const buyerId = booking?.buyer?.buyerId ?? booking?.buyer?.user?.id;
    const sellerId = booking?.bike?.sellerId ?? loggedInSellerId;

    if (!bookingId || !bikeId || !buyerId) {
      console.log("Booking data incomplete:", booking);
      toast.error("Cannot open chat — incomplete booking data");
      return;
    }

    if (!sellerId) {
      console.warn("sellerId is missing — using fallback failed", booking);
      toast.error("Cannot open chat — seller not identified");
      return;
    }

    navigate(
      `/chat?bookingId=${bookingId}&bike=${bikeId}&buyer=${buyerId}&seller=${sellerId}`
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Pending Bike Requests</h2>

      {bookings.length === 0 && <p>No pending requests</p>}

      {bookings.map((b) => {
        const bikeName = `${b.bike?.brand || ""} ${b.bike?.model || ""}`;
        const buyerName = b.buyer?.user?.firstName ?? "Unknown Buyer";
        return (
          <div
            key={b.id}
            className="border p-3 rounded mb-2 flex justify-between items-center"
          >
            <div>
              <p>
                <b>Bike:</b> {bikeName}
              </p>
              <p>
                <b>Buyer:</b> {buyerName}
              </p>
              <p>
                <b>Status:</b> {b.status}
              </p>
            </div>
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded"
              onClick={() => handleChat(b)}
            >
              Chat / Negotiate
            </button>
          </div>
        );
      })}
    </div>
  );
}
