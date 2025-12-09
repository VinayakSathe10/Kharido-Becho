// src/components/BikeComponent/ChatInput.jsx
import React, { useState } from "react";
// Add this import — adjust path if needed
import { sendBikeBookingMessage } from "../../store/services/bikeBookingServices";

export default function ChatInput({ bookingId, senderId, onMessageSent }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    try {
      setSending(true);
      const res = await sendBikeBookingMessage(
        bookingId,
        /* optional: bikeId if required */
        senderId,
        trimmed
      );

      const newMsg = {
        id: res.id ?? Date.now(),
        senderId,
        text: res.text ?? trimmed,
        timestamp: res.timestamp ?? new Date().toISOString(),
      };

      onMessageSent(newMsg);
      setText("");
    } catch (err) {
      console.error("Send message failed", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSend} style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type message..."
        disabled={sending}
        style={{ flexGrow: 1, padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
      />
      <button
        type="submit"
        disabled={sending || !text.trim()}
        style={{
          padding: "8px 16px",
          backgroundColor: sending ? "#999" : "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: sending ? "not-allowed" : "pointer",
        }}
      >
        {sending ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
