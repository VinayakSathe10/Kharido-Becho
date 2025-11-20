import { baseApi } from './baseApi';

export const forgetPasswordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Forgot Password API - SERVICE CREATED BUT NOT INTEGRATED
    // TODO: Replace with actual endpoint when backend is ready
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: '/api/v1/auth/forgot-password', // Placeholder endpoint
        method: 'POST',
        body: { email },
      }),
    }),
    
    // Reset Password API - SERVICE CREATED BUT NOT INTEGRATED
    // TODO: Replace with actual endpoint when backend is ready
    resetPassword: builder.mutation({
      query: (resetData) => ({
        url: '/api/v1/auth/reset-password', // Placeholder endpoint
        method: 'POST',
        body: resetData,
      }),
    }),
  }),
});

export const { useForgotPasswordMutation, useResetPasswordMutation } = forgetPasswordApi;

