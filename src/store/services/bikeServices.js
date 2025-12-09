import apiClient from "./apiClient";

/*-------------------------------------------------
 🟢 CREATE Bike (JSON)
-------------------------------------------------*/
export const addBike = async (payload) => {
  const response = await apiClient.post("/bikes/post", payload);
  return response.data;
};

/*-------------------------------------------------
 🟢 Upload BIKE Images (Multipart)
-------------------------------------------------*/
export const uploadBikeImage = async (formData) => {
  const response = await apiClient.post("/bikes/image/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/*-------------------------------------------------
 🟢 Get Images of a Bike
-------------------------------------------------*/
export const getBikeImages = async (bikeId) => {
  const response = await apiClient.get(`/bikes/image/get?bikeId=${bikeId}`);
  return response.data;
};

/*-------------------------------------------------
 🟢 Delete Single Image of Bike
-------------------------------------------------*/
export const deleteBikeImage = async (imageId) => {
  const response = await apiClient.delete(`/bikes/image/delete?imageId=${imageId}`);
  return response.data;
};

/*-------------------------------------------------
 🟢 Get Bikes by Seller + Status (Matches Backend)
-------------------------------------------------*/
export const getBikesByStatus = async (sellerId, status, page = 0, size = 50) => {
  const formattedStatus = status.toUpperCase().trim(); // 🔥 required for Enum
  const res = await apiClient.get(
    `/bikes/seller/${sellerId}/status/${formattedStatus}/page/${page}/size/${size}`
  );

  return res.data?.content || [];
};

/*-------------------------------------------------
 🟢 Get Bikes by Seller (Default ACTIVE)
-------------------------------------------------*/
export const getBikesBySeller = async (sellerId, page = 0, size = 50) => {
  const res = await apiClient.get(`/bikes/seller/${sellerId}/page/${page}/size/${size}`);
  return res.data?.content || [];
};

/*-------------------------------------------------
 🟢 Get Bike by ID
-------------------------------------------------*/
export const getBikeById = async (bikeId) => {
  const res = await apiClient.get(`/bikes/get/${bikeId}`);
  return res.data;
};

/*-------------------------------------------------
 🟢 Update Bike (PATCH only changed fields)
-------------------------------------------------*/
export const updateBike = async (bikeId, payload) => {
  const updatePayload = {};

  if (payload.prize !== undefined) updatePayload.prize = Number(payload.prize);
  if (payload.status !== undefined) updatePayload.status = payload.status;
  if (payload.variant !== undefined) updatePayload.variant = payload.variant;
  if (payload.sellerId !== undefined) updatePayload.sellerId = payload.sellerId;

  console.log("Updating bike with payload:", updatePayload);

  const res = await apiClient.patch(`/bikes/patch/${bikeId}`, updatePayload);
  return res.data;
};

/*-------------------------------------------------
 Optional PUT update (full object)
-------------------------------------------------*/
export const updateBikeFull = async (bikeId, payload) => {
  const res = await apiClient.put(`/bikes/put/${bikeId}`, payload);
  return res.data;
};

/*-------------------------------------------------
 🟢 Delete Bike (Hard Delete)
-------------------------------------------------*/
export const deleteBike = async (bikeId) => {
  const res = await apiClient.delete(`/bikes/delete/${bikeId}`);
  return res.data;
};

/*-------------------------------------------------
 🟢 Get All Bikes (Only ACTIVE for Buyers)
-------------------------------------------------*/
export const getAllBikes = async () => {
  const res = await apiClient.get("/bikes/get");
  const list = Array.isArray(res.data) ? res.data : [];
  return list.filter((bike) => (bike.status || "").toUpperCase() === "ACTIVE");
};
