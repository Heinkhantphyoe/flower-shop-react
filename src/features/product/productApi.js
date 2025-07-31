import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL, 
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.user?.token; 
      
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page, categoryId }) => `products?page=${page}&categoryId=${categoryId}`,
    }),
  }),
});

export const { useGetProductsQuery } = productApi;
