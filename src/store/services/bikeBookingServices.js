// src/store/services/bikeBookingServices.js
import apiClient from "./apiClient";

/*-----------------------------------------------------------
  1. Create Bike Booking
  POST /bikes/bookings/post
-----------------------------------------------------------*/
export const createBikeBooking = async (bikeId, buyerId, message) => {
  const payload = { bikeId, buyerId, message };

  const res = await apiClient.post("/bikes/bookings/post", payload);
  // backend response:
  // {
  //   "status": "SUCCESS",
  //   "message": "Bike booking created successfully",
  //   "bookingId": 2,
  //   "bikeId": 1,
  //   "buyerId": 3,
  //   "timestamp": ...
  // }
  return res.data;
};

/*-----------------------------------------------------------
  2. Chat APIs
-----------------------------------------------------------*/

// ✅ GET chat history for a booking
// Backend: GET /bikes/bookings/get/booking?bookingid=ID
// conversation stored as JSON string in "conversation" column
export const getBikeBookingChatMessages = async (bookingId) => {
  const res = await apiClient.get("/bikes/bookings/get/booking", {
    params: { bookingid: bookingId },
  });

  const conv = res.data?.conversation;

  try {
    return conv ? JSON.parse(conv) : [];
  } catch {
    return [];
  }
};

// ✅ SEND message to existing booking
// Backend: POST /bikes/bookings/chat/send?bookingId=2
// Body: { "bikeId": 1, "buyerId": 3, "message": "I LOVE ZMR BIKE" }
export const sendBikeBookingMessage = async (
  bookingId,
  bikeId,
  buyerId,
  message
) => {
  if (!bookingId || isNaN(Number(bookingId))) {
    throw new Error("Invalid bookingId: " + bookingId);
  }
  const payload = { bikeId, buyerId, message };

  const res = await apiClient.post(
    `/bikes/bookings/chat/send?bookingId=${bookingId}`,
    payload
  );

  return res.data;
};



/*-----------------------------------------------------------
  3. Booking Status APIs
  (PENDING / ACCEPTED / SOLD / etc.)
-----------------------------------------------------------*/

// matches: PUT /bikes/bookings/update/status?bookingId=4&status=ACCEPTED
export const updateBikeBookingStatus = async (bookingId, status) => {
  const res = await apiClient.put(
    "/bikes/bookings/update/status",
    null,
    { params: { bookingId, status } }
  );
  return res.data;
};

// PUT /bikes/bookings/reject?bookingId=3
export const rejectBikeBooking = async (bookingId) => {
  const res = await apiClient.put(
    "/bikes/bookings/reject",
    null,
    { params: { bookingId } }
  );
  return res.data;
};

// PUT /bikes/bookings/complete?bookingId=3
export const completeBikeBooking = async (bookingId) => {
  const res = await apiClient.put(
    "/bikes/bookings/complete",
    null,
    { params: { bookingId } }
  );
  return res.data;
};

/*-----------------------------------------------------------
  4. Pending / Single / Delete
-----------------------------------------------------------*/

// GET /bikes/bookings/get/pending
export const getPendingBikeBookings = async () => {
  const res = await apiClient.get("/bikes/bookings/get/pending");
  const data =
    Array.isArray(res.data) || res.data === null
      ? res.data
      : res.data?.content || [];
  return data || [];
};

// GET /bikes/bookings/get/booking?bookingid=2
export const getBikeBookingById = async (bookingId) => {
  const res = await apiClient.get("/bikes/bookings/get/booking", {
    params: { bookingid: bookingId },
  });
  return res.data;
};

// DELETE /bikes/bookings/delete?bookingId=2
export const deleteBikeBooking = async (bookingId) => {
  const res = await apiClient.delete("/bikes/bookings/delete", {
    params: { bookingId },
  });
  return res.data;
};
