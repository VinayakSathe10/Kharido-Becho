// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const BASE_URL = 'http://localhost:8087';

// export const baseApi = createApi({
//   reducerPath: 'api',
//   baseQuery: fetchBaseQuery({
//     baseUrl: BASE_URL,
//     prepareHeaders: (headers, { getState }) => {
//       // Get token from localStorage or state if available
//       const token = localStorage.getItem('token');
//       if (token) {
//         headers.set('authorization', `Bearer ${token}`);
//       }
//       headers.set('Content-Type', 'application/json');
//       return headers;
//     },
//   }),
//   tagTypes: ['Auth', 'Products', 'Dashboard'],
//   endpoints: () => ({}),
// });

import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8087",  // 👈 use your backend port
    credentials: "include",            // 👈 REQUIRED for CSRF + Cookies
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Auth", "Laptops", "Bikes", "LaptopPhotos", "BikeImages"],
  endpoints: () => ({}),
});
