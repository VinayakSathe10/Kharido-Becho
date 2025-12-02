import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import useSellerId from "../hooks/useSellerId";
import {
  getPendingBikeBookings,
  rejectBikeBooking,
  completeBikeBooking,
} from "../store/services/bikeBookingServices";

const SellerRequestListScreen = () => {
  const { sellerId, loading: sellerLoading, error: sellerError } = useSellerId();
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    if (!sellerId) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await getPendingBikeBookings();
        const list = Array.isArray(data) ? data : [];
        // Filter bookings for this seller only, if sellerId is present in booking
        const filtered = list.filter(
          (booking) =>
            !sellerId ||
            booking.sellerId === sellerId ||
            booking.bike?.sellerId === sellerId
        );
        setPendingBookings(filtered);
      } catch (err) {
        console.error("Failed to load pending bike bookings", err);
        toast.error("Failed to load buyer requests.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [sellerId]);

  const handleReject = async (booking) => {
    const bookingId = booking?.id || booking?.bikeBookingId || booking?.bookingId;
    if (!bookingId) return;

    try {
      setActionId(bookingId);
      await rejectBikeBooking(bookingId);
      toast.success("Booking rejected successfully.");
      setPendingBookings((prev) =>
        prev.filter(
          (b) =>
            (b.id ?? b.bikeBookingId ?? b.bookingId) !== bookingId
        )
      );
    } catch (err) {
      console.error("Failed to reject booking", err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to reject booking"
      );
    } finally {
      setActionId(null);
    }
  };

  const handleComplete = async (booking) => {
    const bookingId = booking?.id || booking?.bikeBookingId || booking?.bookingId;
    if (!bookingId) return;

    try {
      setActionId(bookingId);
      await completeBikeBooking(bookingId);
      toast.success("Booking marked as SOLD successfully.");
      setPendingBookings((prev) =>
        prev.filter(
          (b) =>
            (b.id ?? b.bikeBookingId ?? b.bookingId) !== bookingId
        )
      );
    } catch (err) {
      console.error("Failed to complete booking", err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to complete booking"
      );
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900">Buyer Requests</h1>
        {sellerLoading && (
          <p className="text-xs text-gray-500 mt-1">
            Resolving seller profile…
          </p>
        )}
        {sellerError && !sellerLoading && (
          <p className="text-xs text-red-600 mt-1">{sellerError}</p>
        )}
      </div>

      <div className="p-4">
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <p>Loading buyer requests…</p>
          </div>
        ) : pendingBookings.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No pending buyer requests for your bikes.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingBookings.map((booking) => {
              const bike = booking.bike || {};
              const bookingId =
                booking.id ?? booking.bikeBookingId ?? booking.bookingId;
              const buyerName =
                booking.buyer?.user
                  ? `${booking.buyer.user.firstName} ${booking.buyer.user.lastName}`
                  : booking.buyer?.user?.email || "Buyer";

              return (
              <div
                key={bookingId}
                className="bg-white rounded-lg shadow-sm border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    {bike.brand} {bike.model} ({bike.variant})
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Year: {bike.manufactureYear || "N/A"} • Price: ₹{" "}
                    {bike.prize?.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Buyer: {buyerName}
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Status: Pending request from buyer
                  </p>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-md border text-xs md:text-sm border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-60"
                    disabled={actionId === bookingId}
                    onClick={() => handleReject(booking)}
                  >
                    {actionId === bookingId ? "Updating…" : "Reject / Cancel"}
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-md bg-green-600 text-white text-xs md:text-sm hover:bg-green-700 disabled:opacity-60"
                    disabled={actionId === bookingId}
                    onClick={() => handleComplete(booking)}
                  >
                    {actionId === bookingId ? "Updating…" : "Accept & Mark Sold"}
                  </button>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerRequestListScreen;

