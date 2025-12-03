import { useCallback, useEffect, useState } from "react";
import {
  getBikeBookingChatMessages,
  sendBikeBookingMessage,
} from "../store/services/bikeBookingServices";

/**
 * Reusable chat hook bound to a specific bike booking.
 *
 * Responsibilities:
 * - Load chat history for a booking
 * - Provide sendMessage with optimistic UI
 * - Expose loading / sending / error + live messages
 */
export default function useChat(bookingId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  // Initial load of chat history
  useEffect(() => {
    if (!bookingId) return;

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const data = await getBikeBookingChatMessages(bookingId);
        if (!cancelled) {
          setMessages(Array.isArray(data) ? data : []);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load chat messages", err);
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  // Optimistic send
  const sendMessage = useCallback(
    async (content, senderType) => {
      const trimmed = (content || "").trim();
      if (!bookingId || !trimmed) return;

      const tempId = `temp-${Date.now()}`;
      const optimisticMessage = {
        id: tempId,
        bookingId,
        content: trimmed,
        senderType,
        createdAt: new Date().toISOString(),
        optimistic: true,
      };

      setMessages((prev) => [...prev, optimisticMessage]);
      setSending(true);

      try {
        const saved = await sendBikeBookingMessage(bookingId, {
          content: trimmed,
          senderType,
        });

        // Replace optimistic message with server version (if any)
        if (saved) {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === tempId ? saved : msg))
          );
        } else {
          // Just mark the optimistic one as confirmed
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempId ? { ...msg, optimistic: false } : msg
            )
          );
        }
        setError(null);
      } catch (err) {
        console.error("Failed to send chat message", err);
        setError(err);
        // Remove the optimistic message on failure
        setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
        throw err;
      } finally {
        setSending(false);
      }
    },
    [bookingId]
  );

  return {
    messages,
    loading,
    sending,
    error,
    sendMessage,
    setMessages,
  };
}


