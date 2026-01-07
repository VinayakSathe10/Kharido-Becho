// src/pages/bikes/BuyBikes.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllBikes } from "../../store/services/bikeServices";
import BikeCard from "../../components/Bike/buyer/BikeCard";

export default function BuyBikes() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null);
  const [bookedBikeIds, setBookedBikeIds] = useState(() => new Set());

  useEffect(() => {
    loadBikes();
  }, []);

  const loadBikes = async () => {
    try {
      setLoading(true);
      const data = await getAllBikes();
      setBikes(data);
    } catch (err) {
      toast.error("Failed to load bikes.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED handleSendRequest — uses buyerId only
  const handleSendRequest = async (bike) => {
    if (!bike?.bike_id) return;

    // Correct buyerId (buyer table PK)
    const buyerId = Number(localStorage.getItem("buyerId"));

    if (!buyerId) {
      toast.error("Buyer ID not found. Please login again.");
      return;
    }

    const payload = {
      bikeId: bike.bike_id,
      buyerId: buyerId, // ✔ correct ID
      message: "Hi, I am interested in this bike.",
    };

    setRequestingId(bike.bike_id);

    try {
      const resp = await fetch("http://localhost:8087/bikes/bookings/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();

      if (!resp.ok) {
        const errorMessage = data.message || "Failed to send request";

        toast.error(errorMessage);

        // SPECIAL HANDLING: Already created booking
        if (errorMessage.includes("already created a booking")) {
          setBookedBikeIds((prev) => {
            const next = new Set(prev);
            next.add(bike.bike_id);
            return next;
          });
        }

        return;
      }

      toast.success("Request sent successfully!");

      setBookedBikeIds((prev) => {
        const next = new Set(prev);
        next.add(bike.bike_id);
        return next;
      });
    } catch (err) {
      toast.error("Network error while sending request.");
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-2">Bikes</h2>
      <p className="text-gray-600 mb-6">
        Find your next bike from our listings.
      </p>

      {loading ? (
        <p>Loading bikes...</p>
      ) : bikes.length === 0 ? (
        <p>No bikes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bikes.map((bike) => (
            <BikeCard
              key={bike.bike_id}
              bike={bike}
              onRequest={handleSendRequest}
              requesting={requestingId === bike.bike_id}
              isBooked={bookedBikeIds.has(bike.bike_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
