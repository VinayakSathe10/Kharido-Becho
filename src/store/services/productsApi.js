import { baseApi } from './baseApi';

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get All Products - SERVICE CREATED BUT NOT INTEGRATED
    // TODO: Replace with actual endpoint when backend is ready
    getProducts: builder.query({
      query: (params) => ({
        url: '/api/v1/products',
        params,
      }),
      providesTags: ['Products'],
    }),
    
    // Get Product by ID - SERVICE CREATED BUT NOT INTEGRATED
    getProductById: builder.query({
      query: (id) => `/api/v1/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Products', id }],
    }),
    
    // Get Products by Category - SERVICE CREATED BUT NOT INTEGRATED
    getProductsByCategory: builder.query({
      query: ({ category, subCategory }) => ({
        url: '/api/v1/products',
        params: { category, subCategory },
      }),
      providesTags: ['Products'],
    }),
    
    // Create Product (Sell Product) - SERVICE CREATED BUT NOT INTEGRATED
    createProduct: builder.mutation({
      query: (productData) => ({
        url: '/api/v1/products',
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['Products'],
    }),
    
    // Update Product - SERVICE CREATED BUT NOT INTEGRATED
    updateProduct: builder.mutation({
      query: ({ id, ...productData }) => ({
        url: `/api/v1/products/${id}`,
        method: 'PUT',
        body: productData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Products', id }],
    }),
    
    // Delete Product - SERVICE CREATED BUT NOT INTEGRATED
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/api/v1/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductsByCategoryQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;

