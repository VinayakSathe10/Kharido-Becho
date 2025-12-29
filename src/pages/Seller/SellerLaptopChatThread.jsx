// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import {
//   getLaptopBookingById,
//   sendLaptopMessage,
//   updateLaptopBookingStatus,
//   completeLaptopBooking,
// } from "../../store/services/laptopBookingServices";
// import { toast } from "react-toastify";

// export default function SellerLaptopChatThread() {
//   const { bookingId } = useParams();

//   const sellerUserId = Number(localStorage.getItem("sellerUserId"));
//   const [booking, setBooking] = useState(null);
//   const [message, setMessage] = useState("");
//   const chatRef = useRef(null);

//   /* ============================================================
//      LOAD CHAT
//   ============================================================ */
//   const loadChat = async () => {
//     if (!bookingId) return;

//     try {
//       const data = await getLaptopBookingById(bookingId);

//       const conversationArray = Array.isArray(data.conversationJson)
//         ? data.conversationJson
//         : JSON.parse(data.conversationJson || "[]");

//       setBooking({
//         ...data,
//         conversationJson: conversationArray,
//       });

//       // Auto scroll
//       setTimeout(() => {
//         if (chatRef.current) {
//           chatRef.current.scrollTop = chatRef.current.scrollHeight;
//         }
//       }, 100);
//     } catch (error) {
//       console.error("Unable to load seller laptop chat", error);
//       toast.error("Unable to load messages");
//     }
//   };

//   useEffect(() => {
//     loadChat();

//     // auto-refresh every 3 seconds
//     const interval = setInterval(loadChat, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   /* ============================================================
//      SEND MESSAGE
//   ============================================================ */
//   const handleSend = async () => {
//     if (!message.trim()) return;

//     if (!sellerUserId) {
//       toast.error("Please login as seller again to send messages.");
//       return;
//     }

//     try {
//       await sendLaptopMessage(bookingId, sellerUserId, message.trim());
//       setMessage("");
//       loadChat();
//     } catch (err) {
//       console.error("Failed to send seller laptop chat message", err);
//       toast.error("Failed to send message");
//     }
//   };

//   /* ============================================================
//      ACTION BUTTONS (ACCEPT / REJECT / COMPLETE)
//   ============================================================ */
//   const handleAction = async (status) => {
//     try {
//       await updateLaptopBookingStatus(bookingId, status);
//       toast.success(`Booking ${status}`);
//       loadChat();
//     } catch (err) {
//       console.error("Failed to update laptop booking status", err);
//       toast.error("Status update failed");
//     }
//   };

//   const handleComplete = async () => {
//     try {
//       await completeLaptopBooking(bookingId);
//       toast.success("Marked as SOLD");
//       loadChat();
//     } catch (err) {
//       console.error("Failed to complete laptop booking", err);
//       toast.error("Failed to mark SOLD");
//     }
//   };

//   if (!booking) return <p className="p-4">Loading chat…</p>;

//   return (
//     <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-100">
//       {/* HEADER */}
//       <div className="bg-green-700 text-white p-4 shadow-md flex items-center gap-3">
//         <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-700 font-bold">
//           {booking.buyerName?.charAt(0) || "B"}
//         </div>

//         <div>
//           <h2 className="text-lg font-semibold">{booking.buyerName}</h2>
//           <p className="text-xs opacity-90">Buyer</p>
//         </div>
//       </div>

//       {/* STATUS BUTTONS */}
//       <div className="p-3 bg-white flex gap-2 shadow">
//         <button
//           className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm"
//           onClick={() => handleAction("ACCEPTED")}
//         >
//           Accept
//         </button>

//         <button
//           className="bg-red-600 text-white px-3 py-2 rounded-md text-sm"
//           onClick={() => handleAction("REJECTED")}
//         >
//           Reject
//         </button>

//         <button
//           className="bg-purple-600 text-white px-3 py-2 rounded-md text-sm"
//           onClick={() => handleComplete()}
//         >
//           Mark Sold
//         </button>
//       </div>

//       {/* CHAT BODY */}
//       <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
//         {booking.conversationJson.map((msg, i) => {
//           const isSeller = msg.senderId === sellerUserId;

//           return (
//             <div
//               key={i}
//               className={`flex ${isSeller ? "justify-end" : "justify-start"}`}
//             >
//               <div
//                 className={`max-w-xs p-3 rounded-xl text-sm shadow
//                   ${
//                     isSeller
//                       ? "bg-green-600 text-white rounded-br-none"
//                       : "bg-white text-gray-800 rounded-bl-none"
//                   }
//                 `}
//               >
//                 {msg.message}

//                 <p className="text-[10px] opacity-70 mt-1 text-right">
//                   {formatTimestamp(msg.timestamp)}
//                 </p>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* INPUT BOX */}
//       <div className="p-4 bg-white shadow-lg flex gap-2">
//         <input
//           type="text"
//           value={message}
//           placeholder="Type a message..."
//           onChange={(e) => setMessage(e.target.value)}
//           className="flex-1 border rounded-lg p-3 outline-none"
//         />
//         <button
//           onClick={handleSend}
//           className="bg-green-700 hover:bg-green-800 text-white px-5 rounded-lg"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

// /* --------------------------------------------------------------------- */
// function formatTimestamp(ts) {
//   if (!ts) return "";
//   const d = new Date(ts);
//   let h = d.getHours();
//   let m = d.getMinutes();
//   return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${
//     h >= 12 ? "PM" : "AM"
//   }`;
// }

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getLaptopBookingById,
  sendLaptopMessage,
  updateLaptopBookingStatus,
  completeLaptopBooking,
} from "../../store/services/laptopBookingServices";

export default function SellerLaptopChat() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const sellerUserId = Number(localStorage.getItem("sellerUserId"));

  const [booking, setBooking] = useState(null);
  const [message, setMessage] = useState("");
  const chatRef = useRef(null);

  /* =========================
        LOAD CHAT
  ========================== */
  const loadChat = async () => {
    try {
      const response = await getLaptopBookingById(bookingId);
      const data = Array.isArray(response) ? response[0] : response;
      if (!data) return;

      const normalizedConversation = Array.isArray(data.conversation)
        ? [...data.conversation]
        : [];

      setBooking({ ...data, conversation: normalizedConversation });

      requestAnimationFrame(() => {
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      });
    } catch (err) {
      console.error("Failed to load chat:", err);
      toast.error("Failed to load chat");
    }
  };

  useEffect(() => {
    loadChat();
    const timer = setInterval(loadChat, 3000);
    return () => clearInterval(timer);
  }, []);

  /* =========================
        SEND MESSAGE
  ========================== */
  const handleSend = async () => {
    if (!message.trim()) return;
    if (!sellerUserId) return toast.error("Please login again");

    try {
      await sendLaptopMessage(bookingId, sellerUserId, message.trim());
      setMessage("");
      loadChat();
    } catch {
      toast.error("Message failed");
    }
  };

  /* =========================
      SELLER ACTIONS
  ========================== */
  const handleAccept = async () => {
    await updateLaptopBookingStatus(bookingId, "NEGOTIATION");
    toast.success("Deal accepted");
    loadChat();
  };

  const handleReject = async () => {
    await updateLaptopBookingStatus(bookingId, "REJECTED");
    toast.success("Request rejected");
    navigate("/seller/requests");
  };

  const handleComplete = async () => {
    await completeLaptopBooking(bookingId);
    toast.success("Deal completed");
    navigate("/seller/requests");
  };

  if (!booking) return <p className="p-4 text-center">Loading chat...</p>;

  const conversation = Array.isArray(booking.conversation)
    ? booking.conversation
    : [];

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-100">
      {/* HEADER */}
      <div className="bg-green-600 text-white p-4 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white text-green-600 rounded-full flex items-center justify-center font-bold">
            {booking.buyerName?.charAt(0) || "B"}
          </div>

          <div>
            <h2 className="text-lg font-semibold">{booking.buyerName}</h2>
            <p className="text-xs opacity-90">
              Laptop #{booking.laptopId} • Status: {booking.status}
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2">
          <button
            onClick={handleAccept}
            className="bg-white text-green-600 px-3 py-1 rounded"
          >
            Accept
          </button>
          <button
            onClick={handleReject}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Reject
          </button>
          <button
            onClick={handleComplete}
            className="bg-gray-800 px-3 py-1 rounded"
          >
            Complete
          </button>
        </div>
      </div>

      {/* CHAT BODY */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.map((msg, index) => {
          const isSeller = msg.senderId === sellerUserId;
          return (
            <div
              key={index}
              className={`flex ${isSeller ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs p-3 rounded-xl text-sm shadow ${
                  isSeller
                    ? "bg-green-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.message}
                <p className="text-[10px] opacity-70 mt-1 text-right">
                  {formatTimestamp(msg.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* INPUT */}
      <div className="p-4 bg-white shadow-lg flex gap-2">
        <input
          className="flex-1 border rounded-lg p-3 outline-none"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={handleSend}
          className="bg-green-600 hover:bg-green-700 text-white px-5 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}

function formatTimestamp(ts) {
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes();
  return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${
    h >= 12 ? "PM" : "AM"
  }`;
}
