// // src/store/services/laptopBookingServices.js
// import axios from "axios";

// const BASE_URL = "http://localhost:8087/api/laptopBookings";

// /* ======================================================
//    1. CREATE LAPTOP BOOKING (POST)
//    ====================================================== */
// export const createLaptopBooking = async (payload) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/create`, payload);
//     return response.data;
//   } catch (error) {
//     console.error("Error creating laptop booking:", error);
//     throw error;
//   }
// };

// /* ======================================================
//    2. MARK LAPTOP BOOKING AS COMPLETED (POST)
//    URL: /{bookingId}/complete
//    ====================================================== */
// export const completeLaptopBooking = async (bookingId) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/${bookingId}/complete`);
//     return response.data;
//   } catch (error) {
//     console.error("Error completing laptop booking:", error);
//     throw error;
//   }
// };

// /* ======================================================
//    3. UPDATE LAPTOP BOOKING STATUS (PATCH)
//    URL: /{bookingId}/status?status=ACCEPTED
//    ====================================================== */
// export const updateLaptopBookingStatus = async (bookingId, status) => {
//   try {
//     const response = await axios.patch(
//       `${BASE_URL}/${bookingId}/status?status=${status}`
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error updating booking status:", error);
//     throw error;
//   }
// };

// /* ======================================================
//    4. GET LAPTOP BOOKING BY LAPTOP ID (GET)
//    URL: /{laptopBookingId}
//    ====================================================== */
// export const getLaptopBookingById = async (laptopBookingId) => {
//   try {
//     const response = await axios.get(`${BASE_URL}/${laptopBookingId}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching laptop booking:", error);
//     throw error;
//   }
// };

// /* ======================================================
//    5. GET ALL BOOKINGS OF BUYER BY BUYER ID (GET)
//    URL: /buyer/{buyerId}
//    ====================================================== */
// export const getLaptopBookingByBuyer = async (buyerId) => {
//   try {
//     const response = await axios.get(`${BASE_URL}/buyer/${buyerId}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching buyer laptop bookings:", error);
//     throw error;
//   }
// };
// src/store/services/laptopBookingServices.js
import axios from "axios";

const BASE_URL = "http://localhost:8087/api/laptopBookings";

/* ======================================================
   1. CREATE LAPTOP BOOKING (POST)
   ====================================================== */
export const createLaptopBooking = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/create`, payload);
    return response.data;
  } catch (error) {
    console.error("Error creating laptop booking:", error);
    throw error;
  }
};

/* ======================================================
   2. MARK LAPTOP BOOKING AS COMPLETED (POST)
   URL: /{bookingId}/complete
   ====================================================== */
export const completeLaptopBooking = async (bookingId) => {
  try {
    const response = await axios.post(`${BASE_URL}/${bookingId}/complete`);
    return response.data;
  } catch (error) {
    console.error("Error completing laptop booking:", error);
    throw error;
  }
};

/* ======================================================
   3. UPDATE LAPTOP BOOKING STATUS (PATCH)
   URL: /{bookingId}/status?status=ACCEPTED
   ====================================================== */
export const updateLaptopBookingStatus = async (bookingId, status) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/${bookingId}/status?status=${status}`
    );
    return response.data;
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw error;
  }
};

/* ======================================================
   4. GET LAPTOP BOOKING BY BOOKING ID (GET)
   URL: /{laptopBookingId}
   ====================================================== */
export const getLaptopBookingById = async (laptopBookingId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${laptopBookingId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching laptop booking:", error);
    throw error;
  }
};

/* ======================================================
   5. GET ALL BOOKINGS OF BUYER BY BUYER ID (GET)
   URL: /buyer/{buyerId}
   ====================================================== */
export const getLaptopBookingByBuyer = async (buyerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/buyer/${buyerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching buyer laptop bookings:", error);
    throw error;
  }
};

/* ======================================================
   6. SEND MESSAGE IN LAPTOP BOOKING CHAT (POST)
   URL: /{bookingId}/message?senderUserId=..&message=..
   ====================================================== */
export const sendLaptopBookingMessage = async (
  bookingId,
  senderUserId,
  message
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/${bookingId}/message?senderUserId=${senderUserId}&message=${encodeURIComponent(
        message
      )}`
    );
    return response.data;
  } catch (error) {
    console.error("Error sending booking message:", error);
    throw error;
  }
};
