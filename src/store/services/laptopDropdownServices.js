import apiClient from "./apiClient";

export const getRamOptions = () => apiClient.get("/api/dropDown/ram");
export const getStorageOptions = () => apiClient.get("/api/dropDown/storage");
export const getScreenSizes = () => apiClient.get("/api/dropDown/screen-sizes");
export const getMemoryTypes = () => apiClient.get("/api/dropDown/memory-types");
export const getProcessorBrands = () =>
  apiClient.get("/api/dropDown/processor-brands");
export const getGraphicsBrands = () =>
  apiClient.get("/api/dropDown/graphics-brands");
export const getWarrantyOptions = () => apiClient.get("/api/dropDown/warranty");

export const createOrGetBrand = (brand) =>
  apiClient.post("/api/dropDown/brand", null, { params: { brand } });

export const createOrGetModel = (brand, model) =>
  apiClient.post("/api/dropDown/model", null, { params: { brand, model } });
