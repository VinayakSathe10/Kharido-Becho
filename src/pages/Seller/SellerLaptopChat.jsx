import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getLaptopBookingById,
  sendLaptopMessage,
} from "../../store/services/laptopBookingServices";

export default function SellerLaptopChat() {
  const { bookingId } = useParams();
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

      // Backend returns array → normalize
      const data = Array.isArray(response) ? response[0] : response;
      if (!data) return;

      // 🔥 FORCE new array reference so React re-renders
      const normalizedConversation = Array.isArray(data.conversation)
        ? [...data.conversation]
        : [];

      setBooking({
        ...data,
        conversation: normalizedConversation,
      });

      // Auto scroll after render
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

    if (!sellerUserId) {
      toast.error("Please login again");
      return;
    }

    try {
      await sendLaptopMessage(bookingId, sellerUserId, message.trim());
      setMessage("");
      loadChat();
    } catch (err) {
      console.error("Send failed:", err);
      toast.error("Message failed");
    }
  };

  if (!booking) return <p className="p-4 text-center">Loading chat...</p>;

  const conversation = Array.isArray(booking.conversation)
    ? booking.conversation
    : [];

  console.log("🧪 RENDER booking:", booking);
  console.log("🧪 RENDER conversation:", booking?.conversation);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-100">
      {/* HEADER */}
      <div className="bg-green-600 text-white p-4 shadow-md flex items-center gap-3">
        <div className="w-10 h-10 bg-white text-green-600 rounded-full flex items-center justify-center font-bold">
          {booking.buyerName?.charAt(0) || "B"}
        </div>

        <div>
          <h2 className="text-lg font-semibold">{booking.buyerName}</h2>
          <p className="text-xs opacity-90">
            Buyer ID: {booking.buyerId} • Laptop #{booking.laptopId}
          </p>
        </div>
      </div>

      {/* INFO BAR */}
      <div className="bg-white p-3 border-b text-sm flex justify-between">
        <span>📦 Booking #{booking.laptopBookingId}</span>
        <span>
          Status: <b>{booking.status}</b>
        </span>
      </div>

      {/* CHAT BODY */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No messages yet. Start the conversation.
          </p>
        )}

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

/* =========================
        FORMAT TIME
========================== */
function formatTimestamp(ts) {
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes();
  return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${
    h >= 12 ? "PM" : "AM"
  }`;
}
