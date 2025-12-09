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
