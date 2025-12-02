import apiClient from "./apiClient";

// 1. Create a new bike booking (buyer sends request to seller)
export const createBikeBooking = async (bikeId, buyerId, message) => {
  const payload = {
    bikeId,
    buyerId,
    message,
  };

  const res = await apiClient.post("/bikes/bookings/post", payload, {
    params: { bikeId, buyerId, message },
  });

  return res.data;
};

// 2. Send chat message for a booking
export const sendBikeBookingMessage = async (bookingId, payload) => {
  const res = await apiClient.post(
    `/bikes/bookings/chat/send`,
    payload,
    { params: { bookingId } }
  );
  return res.data;
};

// 3. Update booking status generically (e.g. ACCEPTED / REJECTED)
export const updateBikeBookingStatus = async (bookingId, status) => {
  const res = await apiClient.put(
    "/bikes/bookings/update/status",
    { status },
    { params: { bookingId, status } }
  );
  return res.data;
};

// 4. Explicit reject endpoint
export const rejectBikeBooking = async (bookingId) => {
  const res = await apiClient.put(
    "/bikes/bookings/reject",
    { bookingId },
    { params: { bookingId } }
  );
  return res.data;
};

// 5. Mark booking as completed / SOLD
export const completeBikeBooking = async (bookingId) => {
  const res = await apiClient.put(
    "/bikes/bookings/complete",
    { bookingId },
    { params: { bookingId } }
  );
  return res.data;
};

// 6. Get all pending bookings (we can filter by seller on the frontend)
export const getPendingBikeBookings = async () => {
  const res = await apiClient.get("/bikes/bookings/get/pending");
  const data =
    Array.isArray(res.data) || res.data === null
      ? res.data
      : res.data?.content || [];
  return data || [];
};

// 7. Get single booking by id
export const getBikeBookingById = async (bookingId) => {
  const res = await apiClient.get("/bikes/bookings/get/booking", {
    params: { bookingid: bookingId },
  });
  return res.data;
};

// 8. Delete booking
export const deleteBikeBooking = async (bookingId) => {
  const res = await apiClient.delete("/bikes/bookings/delete", {
    params: { bookingId },
  });
  return res.data;
};


