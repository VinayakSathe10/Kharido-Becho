// import apiClient from "./apiClient";

// export const addMobile = async (payload) => {
//   const response = await apiClient.post("/api/v1/mobiles/add", payload);
//   return response.data;
// };

// export const updateMobile = async (id, payload) => {
//   const response = await apiClient.patch(
//     `/api/v1/mobiles/update/${id}`,
//     payload
//   );
//   return response.data;
// };

// export const getMobileById = async (id) => {
//   const response = await apiClient.get(`/api/v1/mobiles/${id}`);
//   return response.data;
// };

// export const getAllMobiles = async () => {
//   const response = await apiClient.get("/api/v1/mobiles/getAllMobiles");
//   return response.data;
// };

// export const deleteMobile = async (id) => {
//   const response = await apiClient.delete(`/api/v1/mobiles/delete/${id}`);
//   return response.data;
// };

// export const getMobilesBySeller = async (sellerId) => {
//   const res = await apiClient.get(`/api/v1/mobiles/${sellerId}`);
//   return Array.isArray(res.data) ? res.data : [];
// };
// src/store/services/mobileServices.js
// import apiClient from "./apiClient";

// // ➤ Add Mobile
// export const addMobile = async (payload) => {
//   const response = await apiClient.post("/api/v1/mobiles/add", payload);
//   return response.data;
// };

// // ➤ Update Mobile
// export const updateMobile = async (id, payload) => {
//   const response = await apiClient.patch(
//     `/api/v1/mobiles/update/${id}`,
//     payload
//   );
//   return response.data;
// };

// // ➤ Get Mobile by ID
// export const getMobileById = async (id) => {
//   const response = await apiClient.get(`/api/v1/mobiles/${id}`);
//   return response.data;
// };

// // ➤ Get All Mobiles (Paged)
// export const getAllMobiles = async (page = 0, size = 20, sellerId = null) => {
//   const response = await apiClient.get("/api/v1/mobiles/getAllMobiles", {
//     params: {
//       page,
//       size,
//       sellerId: sellerId ? sellerId : undefined,
//     },
//   });

//   // Return actual content array
//   return response.data.content || [];
// };

// // ➤ Delete (Soft Delete)
// export const deleteMobile = async (id) => {
//   const response = await apiClient.delete(`/api/v1/mobiles/delete/${id}`);
//   return response.data;
// };
import apiClient from "./apiClient";

/* -----------------------------------------
   CREATE MOBILE
------------------------------------------ */
export const addMobile = async (payload) => {
  const res = await apiClient.post("/api/v1/mobiles/add", payload);
  return res.data;
};

/* -----------------------------------------
   UPDATE MOBILE
------------------------------------------ */
export const updateMobile = async (id, payload) => {
  const res = await apiClient.patch(`/api/v1/mobiles/update/${id}`, payload);
  return res.data;
};

/* -----------------------------------------
   GET MOBILE BY ID
------------------------------------------ */
export const getMobileById = async (id) => {
  const res = await apiClient.get(`/api/v1/mobiles/${id}`);
  return res.data;
};

/* -----------------------------------------
   GET ALL MOBILES (Client listing)
------------------------------------------ */
// export const getAllMobiles = async (page = 0, size = 100) => {
//   const res = await apiClient.get(
//     `/api/v1/mobiles/getAllMobiles?page=${page}&size=${size}`
//   );

//   return res.data?.content || [];
// };
export const getAllMobiles = async (page = 0, size = 100) => {
  const res = await apiClient.get(
    `/api/v1/mobiles/getAllMobiles?page=${page}&size=${size}`
  );
  return res.data?.content || [];
};

/* -----------------------------------------
   GET MOBILES BY SELLER (Dashboard)
------------------------------------------ */
export const getMobilesBySeller = async (sellerId) => {
  const res = await apiClient.get(
    `/api/v1/mobiles/getAllMobiles?sellerId=${sellerId}&page=0&size=100`
  );

  return res.data?.content || [];
};

/* -----------------------------------------
   DELETE MOBILE
------------------------------------------ */
export const deleteMobile = async (id) => {
  const res = await apiClient.delete(`/api/v1/mobiles/delete/${id}`);
  return res.data;
};
