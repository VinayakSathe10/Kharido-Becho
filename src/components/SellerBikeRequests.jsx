import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import useSellerId from "../hooks/useSellerId";
import {
  getPendingBikeBookings,
  rejectBikeBooking,
  completeBikeBooking,
} from "../store/services/bikeBookingServices";

const SellerBikeRequests = () => {
  const { sellerId } = useSellerId();
  const [pendingBikeBookings, setPendingBikeBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!sellerId) return;
        setLoading(true);

        const bikeData = await getPendingBikeBookings();
        const filtered = bikeData.filter(
          (b) => b.sellerId === sellerId || b.bike?.sellerId === sellerId
        );

        setPendingBikeBookings(filtered);
      } catch (err) {
        toast.error("Failed to load bike requests");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [sellerId]);

  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold mb-3">Pending Bike Requests</h2>

      {loading ? (
        <p>Loading...</p>
      ) : pendingBikeBookings.length === 0 ? (
        <p className="text-gray-400">No pending bike requests.</p>
      ) : (
        pendingBikeBookings.map((booking) => {
          const bookingId = booking.id ?? booking.bikeBookingId;
          return (
            <div key={bookingId} className="bg-white p-4 rounded shadow mb-4">
              <h3 className="font-semibold">
                {booking.bike?.brand} {booking.bike?.model}
              </h3>
              <p className="text-sm text-gray-600">
                Buyer: {booking.buyer?.user?.firstName}
              </p>

              <div className="flex gap-2 mt-3">
                <button
                  className="px-3 py-1 border rounded"
                  onClick={async () => {
                    setActionId(bookingId);
                    await rejectBikeBooking(bookingId);
                    toast.success("Bike booking rejected");
                    setPendingBikeBookings((prev) =>
                      prev.filter(
                        (b) => (b.id ?? b.bikeBookingId) !== bookingId
                      )
                    );
                    setActionId(null);
                  }}
                >
                  Reject
                </button>

                <button
                  className="px-3 py-1 bg-green-600 text-white rounded"
                  onClick={async () => {
                    setActionId(bookingId);
                    await completeBikeBooking(bookingId);
                    toast.success("Bike marked SOLD");
                    setPendingBikeBookings((prev) =>
                      prev.filter(
                        (b) => (b.id ?? b.bikeBookingId) !== bookingId
                      )
                    );
                    setActionId(null);
                  }}
                >
                  Mark Sold
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default SellerBikeRequests;
