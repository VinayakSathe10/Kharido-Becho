// // src/components/ChatRequestModal.jsx
// import React, { useState } from "react";
// import Modal from "../../components/commanComponent/Modal";

// export default function ChatRequestModal({ bikeId, sellerId, buyerId, onCancel, onSent }) {
//   const [message, setMessage] = useState("");
//   const [sending, setSending] = useState(false);

//   const handleSend = async () => {
//     if (!message.trim()) {
//       return; // or show error
//     }
//     setSending(true);
//     try {
//       // assume createBikeBooking + sendBikeBookingMessage imported here
//       const booking = await createBikeBooking(bikeId, buyerId, message);
//       const bookingId = booking.bookingId;
//       localStorage.setItem("bikeBookingId", bookingId);

//       await sendBikeBookingMessage(bookingId, bikeId, buyerId, message);

//       onSent({ bookingId, bikeId, sellerId });
//     } catch (err) {
//       if (err.response?.data?.message?.includes("already created")) {
//         const existing = localStorage.getItem("bikeBookingId");
//         onSent({ bookingId: existing, bikeId, sellerId });
//       } else {
//         toast.error(err.response?.data?.message || "Failed to send message");
//       }
//     } finally {
//       setSending(false);
//     }
//   };

//   return (
//     <Modal onClose={onCancel}>
//       <h2>Send message to seller</h2>
//       <textarea
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         placeholder="Hi, I am interested in this bike"
//         rows={4}
//         style={{ width: "100%", marginTop: 10 }}
//       />
//       <div style={{ marginTop: 20, display: "flex", gap: "10px", justifyContent: "flex-end" }}>
//         <button onClick={onCancel} disabled={sending}>Cancel</button>
//         <button onClick={handleSend} disabled={sending || !message.trim()}>
//           {sending ? "Sending..." : "Send"}
//         </button>
//       </div>
//     </Modal>
//   );
// }



// // src/components/BikeComponent/BikeChat.jsx
// import React from "react";
// import { useSearchParams } from "react-router-dom";
// import BookingChat from "./BookingChat";

// export default function BikeChat() {
//   const [searchParams] = useSearchParams();
//   const bookingId = searchParams.get("bookingId");
//   const bikeId = searchParams.get("bike");
//   const sellerId = searchParams.get("seller");
//   const buyerId = localStorage.getItem("buyerId"); // or from auth context

//   if (!bookingId) {
//     return <div>Error: bookingId not provided in URL</div>;
//   }

//   return (
//     <BookingChat
//       bookingId={bookingId}
//       bikeId={bikeId}
//       buyerId={buyerId}
//       sellerId={sellerId}
//     />
//   );
// }


// src/components/BikeComponent/BikeChat.jsx
// src/components/BikeComponent/BookingChat.jsx

import React, { useState, useEffect } from "react";
import ChatInput from "./ChatInput";

export default function BookingChat({ bookingId, buyerId, sellerId }) {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const resp = await fetch(`http://localhost:8087/bookings/${bookingId}/messages`);
      if (!resp.ok) throw new Error("Failed to fetch messages: " + resp.status);
      const data = await resp.json();
      console.log("Fetched messages:", data);        // 🔎 debug
      setMessages(Array.isArray(data) ? data : []); // ensure array
    } catch (err) {
      console.error("Fetch messages error:", err);
    }
  };

  useEffect(() => {
    if (!bookingId) {
      console.warn("BookingChat: no bookingId provided");
      return;
    }
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [bookingId]);

  const handleNewMessage = (msg) => {
    console.log("New message added on client side:", msg); // 🔎 debug
    setMessages((prev) => [...prev, msg]);
  };

  const currentUserId = buyerId ?? sellerId;

  return (
    <div style={{ padding: "16px", maxWidth: "600px", margin: "auto" }}>
      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          border: "1px solid #ddd",
          padding: "8px",
        }}
      >
        {messages.length === 0 && <p>No messages yet</p>}
        {messages.map((m) => (
          <div
            key={m.id ?? m.timestamp /* fallback key */}
            style={{
              textAlign: m.senderId === currentUserId ? "right" : "left",
              margin: "8px 0",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "8px",
                borderRadius: "8px",
                background: m.senderId === currentUserId ? "#daf1da" : "#eee",
              }}
            >
              <div>{m.text ?? m.message /* depending on your API */}</div>
              {m.timestamp && (
                <div style={{ fontSize: "0.8em", color: "#555" }}>
                  {new Date(m.timestamp).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <ChatInput bookingId={bookingId} senderId={currentUserId} onMessageSent={handleNewMessage} />
    </div>
  );
}
