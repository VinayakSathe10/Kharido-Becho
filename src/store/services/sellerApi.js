import { baseApi } from './baseApi';

export const sellerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addLaptop: builder.mutation({
      query: (payload) => ({
        url: '/api/laptops/create',
        method: 'POST',
        body: payload,
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['Laptops'],
    }),
    updateLaptop: builder.mutation({
      query: ({ laptopId, body }) => ({
        url: `/api/laptops/update`,
        method: 'PATCH',
        params: { laptopId },
        body,
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['Laptops'],
    }),
    getLaptopById: builder.query({
      query: (laptopId) => ({
        url: '/api/laptops/getById',
        params: { laptop_id: laptopId },
      }),
      providesTags: ['Laptops'],
    }),
    deleteLaptop: builder.mutation({
      query: (laptopId) => ({
        url: '/api/laptops/delete',
        method: 'DELETE',
        params: { laptopId },
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['Laptops'],
    }),

    addBike: builder.mutation({
      query: (payload) => ({
        url: '/bikes/post',
        method: 'POST',
        body: payload,
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['Bikes'],
    }),
    updateBike: builder.mutation({
      query: ({ bikeId, body }) => ({
        url: `/bikes/patch/${bikeId}`,
        method: 'PATCH',
        body,
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['Bikes'],
    }),
    softDeleteBike: builder.mutation({
      query: (bikeId) => ({
        url: `/bikes/patch/${bikeId}/soft-delete`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Bikes'],
    }),
    getBikeById: builder.query({
      query: (bikeId) => ({
        url: `/bikes/get/${bikeId}`,
      }),
      providesTags: ['Bikes'],
    }),
    deleteBike: builder.mutation({
      query: (bikeId) => ({
        url: `/bikes/delete/${bikeId}`,
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['Bikes'],
    }),

    uploadLaptopPhoto: builder.mutation({
      query: ({ laptopId, files }) => {
        const formData = new FormData();
        formData.append('files', files);
        return {
          url: `/api/photo/upload`,
          method: 'POST',
          params: { laptopid: laptopId },
          body: formData,
          formData: true,
          headers: {
            // Let browser set boundary
          },
        };
      },
      invalidatesTags: ['LaptopPhotos'],
    }),
    deleteLaptopPhoto: builder.mutation({
      query: (photoId) => ({
        url: `/api/photo/delete`,
        method: 'DELETE',
        params: { photoId },
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['LaptopPhotos'],
    }),

    uploadBikeImage: builder.mutation({
      query: ({ bikeId, files }) => {
        const formData = new FormData();
        formData.append('files', files);
        formData.append('BikeId', bikeId);
        return {
          url: '/bikes/image/upload',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['BikeImages'],
    }),
    getBikeImages: builder.query({
      query: (bikeId) => ({
        url: '/bikes/image/get',
        params: { bikeId },
      }),
      providesTags: ['BikeImages'],
    }),
    deleteBikeImage: builder.mutation({
      query: (imageId) => ({
        url: '/bikes/image/delete',
        method: 'DELETE',
        params: { imageId },
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['BikeImages'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAddLaptopMutation,
  useUpdateLaptopMutation,
  useGetLaptopByIdQuery,
  useDeleteLaptopMutation,
  useAddBikeMutation,
  useUpdateBikeMutation,
  useSoftDeleteBikeMutation,
  useGetBikeByIdQuery,
  useDeleteBikeMutation,
  useUploadLaptopPhotoMutation,
  useDeleteLaptopPhotoMutation,
  useUploadBikeImageMutation,
  useGetBikeImagesQuery,
  useDeleteBikeImageMutation,
} = sellerApi;

