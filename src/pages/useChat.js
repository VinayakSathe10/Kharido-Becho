import { useCallback, useEffect, useState } from "react";
import {
  getBikeBookingChatMessages,
  sendBikeBookingMessage,
} from "../store/services/bikeBookingServices";

export default function useChat(bookingId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  // Load initial chat history when bookingId changes
  useEffect(() => {
    if (!bookingId) {
      setMessages([]);
      setError(null);
      return;
    }

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
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  // Optimistic send
  const sendMessage = useCallback(
    async (content, senderType, extra = {}) => {
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
        ...extra,
      };

      setMessages((prev) => [...prev, optimisticMessage]);
      setSending(true);

      try {
        // Adjust args if API expects (bookingId, bikeId, userId, text)
        const saved = await sendBikeBookingMessage(
          bookingId,
          trimmed,
          senderType
        );

        if (saved && saved.id) {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === tempId ? saved : msg))
          );
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempId ? { ...m, optimistic: false } : m
            )
          );
        }

        setError(null);
        return saved;
      } catch (err) {
        console.error("Failed to send chat message", err);
        setError(err);

        // Remove optimistic message if send fails
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
