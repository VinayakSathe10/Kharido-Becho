import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login API - INTEGRATED
    login: builder.mutation({
      query: (credentials) => ({
        url: '/jwt/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    
    // Register API - INTEGRATED
    register: builder.mutation({
      query: (userData) => ({
        url: '/api/v1/users/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;

