// import apiClient from "./apiClient";

// export const addBike = async (payload) => {
//   const response = await apiClient.post("/bikes/post", payload, {
//     headers: { "Content-Type": "application/json" },
//   });
//   return response.data;
// };
// import apiClient from "./apiClient";

// // 📌 CREATE BIKE (JSON)
// export const addBike = async (payload) => {
//   const response = await apiClient.post("/bikes/post", payload);
//   return response.data;
// };

// // 📌 UPLOAD BIKE IMAGES (MULTIPART)
// export const uploadBikeImage = async (formData) => {
//   const response = await apiClient.post("/bikes/image/upload", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
//   return response.data;
// };

// // 📌 GET IMAGES OF BIKE
// export const getBikeImages = async (bikeId) => {
//   const response = await apiClient.get(`/bikes/image/get?bikeId=${bikeId}`);
//   return response.data;
// };

// // 📌 DELETE BIKE IMAGE
// export const deleteBikeImage = async (imageId) => {
//   const response = await apiClient.delete(
//     `/bikes/image/delete?imageId=${imageId}`
//   );
//   return response.data;
// };

// /**
//  * Get bikes for a seller filtered by status.
//  * Backend endpoint pattern already used for ACTIVE, we reuse it for other statuses.
//  */
// export const getBikesByStatus = async (sellerId, status) => {
//   const res = await apiClient.get(
//     `/bikes/seller/${sellerId}/status/${status}/page/0/size/50`
//   );
//   return res.data?.content || [];
// };

// /**
//  * Backwards‑compatible helper – keeps existing behaviour (ACTIVE only).
//  */
// export const getBikesBySeller = async (sellerId) => {
//   return getBikesByStatus(sellerId, "ACTIVE");
// };

// // GET BIKE BY ID
// export const getBikeById = async (bikeId) => {
//   const res = await apiClient.get(`/bikes/get/${bikeId}`);
//   return res.data;
// };

// // EDIT bike
// export const updateBike = async (bikeId, payload) => {
//   const res = await apiClient.patch(`/bikes/patch/${bikeId}`, payload);
//   return res.data;
// };

// // DELETE bike
// export const deleteBike = async (bikeId) => {
//   const res = await apiClient.delete(`/bikes/delete/${bikeId}`);
//   return res.data;
// };

// // GET ALL BIKES (for buyers) – show only ACTIVE bikes on client side
// export const getAllBikes = async () => {
//   const res = await apiClient.get("/bikes/get");
//   const list = Array.isArray(res.data) ? res.data : [];
//   return list.filter(
//     (bike) =>
//       (bike.status || "").toString().toUpperCase() === "ACTIVE"
//   );
// };

import apiClient from "./apiClient";

// 📌 CREATE BIKE (JSON)
export const addBike = async (payload) => {
  const response = await apiClient.post("/bikes/post", payload);
  return response.data;
};

// 📌 UPLOAD BIKE IMAGES (MULTIPART)
export const uploadBikeImage = async (formData) => {
  const response = await apiClient.post("/bikes/image/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 📌 GET IMAGES OF BIKE
export const getBikeImages = async (bikeId) => {
  const response = await apiClient.get(`/bikes/image/get?bikeId=${bikeId}`);
  return response.data;
};

// 📌 DELETE BIKE IMAGE
export const deleteBikeImage = async (imageId) => {
  const response = await apiClient.delete(
    `/bikes/image/delete?imageId=${imageId}`
  );
  return response.data;
};

/**
 * Get bikes for a seller filtered by status.
 * Backend endpoint pattern already used for ACTIVE, we reuse it for other statuses.
 */
export const getBikesByStatus = async (sellerId, status) => {
  const res = await apiClient.get(
    `/bikes/seller/${sellerId}/status/${status}/page/0/size/50`
  );
  return res.data?.content || [];
};

/**
 * Backwards‑compatible helper – keeps existing behaviour (ACTIVE only).
 */
export const getBikesBySeller = async (sellerId) => {
  return getBikesByStatus(sellerId, "ACTIVE");
};

// GET BIKE BY ID
export const getBikeById = async (bikeId) => {
  const res = await apiClient.get(`/bikes/get/${bikeId}`);
  return res.data;
};

// EDIT bike - Send only the fields that need to be updated
export const updateBike = async (bikeId, payload) => {
  // Extract only the fields that should be updated
  const updatePayload = {};

  // Only include prize if it's provided and is a valid number
  if (payload.prize !== undefined && payload.prize !== null) {
    updatePayload.prize = Number(payload.prize);
  }

  // Only include status if it's provided
  if (payload.status !== undefined && payload.status !== null) {
    updatePayload.status = payload.status;
  }

  // You can add other fields that are allowed to be updated
  if (payload.variant !== undefined && payload.variant !== null) {
    updatePayload.variant = payload.variant;
  }

  // Add sellerId if needed
  if (payload.sellerId !== undefined && payload.sellerId !== null) {
    updatePayload.sellerId = payload.sellerId;
  }

  console.log("Updating bike with payload:", updatePayload);

  const res = await apiClient.patch(`/bikes/patch/${bikeId}`, updatePayload);
  return res.data;
};

// Alternative: If your backend expects full object update (PUT instead of PATCH)
export const updateBikeFull = async (bikeId, payload) => {
  const res = await apiClient.put(`/bikes/put/${bikeId}`, payload);
  return res.data;
};

// DELETE bike
export const deleteBike = async (bikeId) => {
  const res = await apiClient.delete(`/bikes/delete/${bikeId}`);
  return res.data;
};

// GET ALL BIKES (for buyers) – show only ACTIVE bikes on client side
export const getAllBikes = async () => {
  const res = await apiClient.get("/bikes/get");
  const list = Array.isArray(res.data) ? res.data : [];
  return list.filter(
    (bike) => (bike.status || "").toString().toUpperCase() === "ACTIVE"
  );
};
