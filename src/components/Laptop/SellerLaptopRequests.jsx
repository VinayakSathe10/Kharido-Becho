import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import useSellerId from "../../hooks/useSellerId";
import {
  getLaptopBookingByBuyer,
  getLaptopBookingById,
  updateLaptopBookingStatus,
  completeLaptopBooking,
} from "../../store/services/laptopBookingServices";

const SellerLaptopRequests = () => {
  const { sellerId } = useSellerId();
  const buyerId = Number(localStorage.getItem("buyerId"));

  const [sellerLaptopBookings, setSellerLaptopBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (!buyerId || !sellerId) return;
        setLoading(true);

        const data = await getLaptopBookingByBuyer(buyerId);
        const list = Array.isArray(data) ? data : [data];

        let sellerList = [];
        for (let booking of list) {
          const record = await getLaptopBookingById(booking.laptopBookingId);
          if (record.sellerId === sellerId) sellerList.push(record);
        }

        setSellerLaptopBookings(sellerList);
      } catch (err) {
        toast.error("Failed to load laptop requests");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [buyerId, sellerId]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Laptop Requests</h2>

      {loading ? (
        <p>Loading...</p>
      ) : sellerLaptopBookings.length === 0 ? (
        <p className="text-gray-400">No laptop requests.</p>
      ) : (
        sellerLaptopBookings.map((booking) => (
          <div
            key={booking.laptopBookingId}
            className="bg-white p-4 rounded shadow mb-4"
          >
            <h3 className="font-semibold">
              Laptop Request #{booking.laptopBookingId}
            </h3>
            <p className="text-sm">Laptop ID: {booking.laptopId}</p>
            <p className="text-sm">Status: {booking.status}</p>

            <div className="flex gap-2 mt-3">
              <button
                className="px-3 py-1 border rounded"
                onClick={async () => {
                  await updateLaptopBookingStatus(
                    booking.laptopBookingId,
                    "REJECTED"
                  );
                  toast.success("Laptop rejected");
                  setSellerLaptopBookings((prev) =>
                    prev.filter(
                      (b) => b.laptopBookingId !== booking.laptopBookingId
                    )
                  );
                }}
              >
                Reject
              </button>

              <button
                className="px-3 py-1 bg-green-600 text-white rounded"
                onClick={async () => {
                  await completeLaptopBooking(booking.laptopBookingId);
                  toast.success("Laptop marked SOLD");
                  setSellerLaptopBookings((prev) =>
                    prev.filter(
                      (b) => b.laptopBookingId !== booking.laptopBookingId
                    )
                  );
                }}
              >
                Mark Sold
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SellerLaptopRequests;
