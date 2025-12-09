import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  getLaptopBookingById,
  sendLaptopBookingMessage,
  updateLaptopBookingStatus,
  completeLaptopBooking,
} from "../../store/services/laptopBookingServices";
import { toast } from "react-toastify";

export default function SellerLaptopChatThread() {
  const { bookingId } = useParams();

  const sellerUserId = Number(localStorage.getItem("sellerUserId"));
  const [booking, setBooking] = useState(null);
  const [message, setMessage] = useState("");
  const chatRef = useRef(null);

  /* ============================================================
     LOAD CHAT
  ============================================================ */
  const loadChat = async () => {
    if (!bookingId) return;

    try {
      const data = await getLaptopBookingById(bookingId);

      const conversationArray = Array.isArray(data.conversationJson)
        ? data.conversationJson
        : JSON.parse(data.conversationJson || "[]");

      setBooking({
        ...data,
        conversationJson: conversationArray,
      });

      // Auto scroll
      setTimeout(() => {
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error("Unable to load seller laptop chat", error);
      toast.error("Unable to load messages");
    }
  };

  useEffect(() => {
    loadChat();

    // auto-refresh every 3 seconds
    const interval = setInterval(loadChat, 3000);
    return () => clearInterval(interval);
  }, []);

  /* ============================================================
     SEND MESSAGE
  ============================================================ */
  const handleSend = async () => {
    if (!message.trim()) return;

    if (!sellerUserId) {
      toast.error("Please login as seller again to send messages.");
      return;
    }

    try {
      await sendLaptopBookingMessage(bookingId, sellerUserId, message.trim());
      setMessage("");
      loadChat();
    } catch (err) {
      console.error("Failed to send seller laptop chat message", err);
      toast.error("Failed to send message");
    }
  };

  /* ============================================================
     ACTION BUTTONS (ACCEPT / REJECT / COMPLETE)
  ============================================================ */
  const handleAction = async (status) => {
    try {
      await updateLaptopBookingStatus(bookingId, status);
      toast.success(`Booking ${status}`);
      loadChat();
    } catch (err) {
      console.error("Failed to update laptop booking status", err);
      toast.error("Status update failed");
    }
  };

  const handleComplete = async () => {
    try {
      await completeLaptopBooking(bookingId);
      toast.success("Marked as SOLD");
      loadChat();
    } catch (err) {
      console.error("Failed to complete laptop booking", err);
      toast.error("Failed to mark SOLD");
    }
  };

  if (!booking) return <p className="p-4">Loading chat…</p>;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-100">
      {/* HEADER */}
      <div className="bg-green-700 text-white p-4 shadow-md flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-700 font-bold">
          {booking.buyerName?.charAt(0) || "B"}
        </div>

        <div>
          <h2 className="text-lg font-semibold">{booking.buyerName}</h2>
          <p className="text-xs opacity-90">Buyer</p>
        </div>
      </div>

      {/* STATUS BUTTONS */}
      <div className="p-3 bg-white flex gap-2 shadow">
        <button
          className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm"
          onClick={() => handleAction("ACCEPTED")}
        >
          Accept
        </button>

        <button
          className="bg-red-600 text-white px-3 py-2 rounded-md text-sm"
          onClick={() => handleAction("REJECTED")}
        >
          Reject
        </button>

        <button
          className="bg-purple-600 text-white px-3 py-2 rounded-md text-sm"
          onClick={() => handleComplete()}
        >
          Mark Sold
        </button>
      </div>

      {/* CHAT BODY */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {booking.conversationJson.map((msg, i) => {
          const isSeller = msg.senderId === sellerUserId;

          return (
            <div
              key={i}
              className={`flex ${isSeller ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs p-3 rounded-xl text-sm shadow
                  ${
                    isSeller
                      ? "bg-green-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none"
                  }
                `}
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

      {/* INPUT BOX */}
      <div className="p-4 bg-white shadow-lg flex gap-2">
        <input
          type="text"
          value={message}
          placeholder="Type a message..."
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border rounded-lg p-3 outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-green-700 hover:bg-green-800 text-white px-5 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------- */
function formatTimestamp(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  let h = d.getHours();
  let m = d.getMinutes();
  return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${
    h >= 12 ? "PM" : "AM"
  }`;
}
