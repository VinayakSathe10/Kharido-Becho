import { useState, useCallback, useEffect } from "react";
import {
    getBikeBookingsForSeller,
    sendBikeBookingMessage,
    getBikeBookingById,
} from "../store/services/bikeBookingServices";

/**
 * Custom hook to manage seller interactions for bike bookings.
 * Provides functionality to fetch bookings and send messages.
 *
 * @param {string|number} [bookingId] - Optional booking ID to fetch chat interactions for.
 */
const useChatSeller = (bookingId) => {
    const [bookings, setBookings] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sending, setSending] = useState(false);

    // Fetch all bookings for a specific seller
    const fetchBookings = useCallback(async (sellerId) => {
        if (!sellerId) return;

        setLoading(true);
        setError(null);
        try {
            const data = await getBikeBookingsForSeller(sellerId);
            setBookings(data || []);
        } catch (err) {
            console.error("Error fetching seller bookings:", err);
            setError(err.response?.data?.message || "Failed to fetch bookings");
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch messages for the current booking
    const fetchMessages = useCallback(async () => {
        if (!bookingId) return;

        try {
            // Use getBikeBookingById instead of the 404 endpoint
            const bookingData = await getBikeBookingById(bookingId);

            // Extract conversation or messages from the booking object
            // Adjust based on actual API response structure (likely 'conversation' or 'messages')
            const msgs = bookingData?.conversation || bookingData?.messages || [];

            // Map 'message' field to 'content' for UI consistency if needed
            const formatted = (msgs || []).map((m) => ({
                ...m,
                content: m.content || m.message || "",
            }));
            setMessages(formatted);
        } catch (err) {
            console.error("Error fetching messages:", err);
            // Don't set global error to avoid blocking UI on poll
        } finally {
            setLoading(false);
        }
    }, [bookingId]);

    // Initial fetch of messages when bookingId changes
    useEffect(() => {
        if (bookingId) {
            setLoading(true);
            fetchMessages();
        } else {
            setMessages([]);
        }
    }, [bookingId, fetchMessages]);

    // Send a chat message for a specific booking
    // If content is passed as string, it wraps it. If object, uses it.
    const sendMessage = useCallback(
        async (contentOrPayload) => {
            if (!bookingId) return;

            setSending(true);
            try {
                let payload = {};

                if (typeof contentOrPayload === "string") {
                    // Backend expects 'message' field
                    payload = { message: contentOrPayload };
                } else {
                    // Assume caller knows what they are doing, but ensure 'message' exists if 'content' matches
                    payload = { ...contentOrPayload };
                    if (payload.content && !payload.message) {
                        payload.message = payload.content;
                    }
                }

                const response = await sendBikeBookingMessage(bookingId, payload);

                // Refresh messages after sending
                await fetchMessages();

                return response;
            } catch (err) {
                console.error("Error sending message:", err);
                setError(err.response?.data?.message || "Failed to send message");
                throw err;
            } finally {
                setSending(false);
            }
        },
        [bookingId, fetchMessages]
    );

    return {
        bookings,
        messages,
        loading,
        error,
        sending,
        fetchBookings,
        fetchMessages,
        sendMessage,
    };
};

export default useChatSeller;
