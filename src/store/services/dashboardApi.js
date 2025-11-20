import { baseApi } from './baseApi';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Dashboard Stats - SERVICE CREATED BUT NOT INTEGRATED
    // TODO: Replace with actual endpoint when backend is ready
    getDashboardStats: builder.query({
      query: () => '/api/v1/dashboard/stats',
      providesTags: ['Dashboard'],
    }),
    
    // Get My Listings - SERVICE CREATED BUT NOT INTEGRATED
    getMyListings: builder.query({
      query: (params) => ({
        url: '/api/v1/dashboard/listings',
        params,
      }),
      providesTags: ['Dashboard'],
    }),
    
    // Get Listing by ID - SERVICE CREATED BUT NOT INTEGRATED
    getListingById: builder.query({
      query: (id) => `/api/v1/dashboard/listings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Dashboard', id }],
    }),
    
    // Update Listing Status - SERVICE CREATED BUT NOT INTEGRATED
    updateListingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/v1/dashboard/listings/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetMyListingsQuery,
  useGetListingByIdQuery,
  useUpdateListingStatusMutation,
} = dashboardApi;

