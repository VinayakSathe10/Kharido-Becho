import apiClient from "./apiClient";

// 📌 GET ONLY BRANDS
export const getBikeBrands = async () => {
  const res = await apiClient.get("/bikes/brands/brands/Only-brands");
  return res.data;
};

// 📌 GET MODELS BY BRAND (Query Param)
export const getBikeModels = async (brand) => {
  const res = await apiClient.get("/bikes/brands/models", {
    params: { brand },
  });
  return res.data;
};

// 📌 GET VARIANTS BY BRAND + MODEL (Query Params)
export const getBikeVariants = async (brand, model) => {
  const res = await apiClient.get("/bikes/brands/variants", {
    params: { brand, model },
  });
  return res.data;
};
