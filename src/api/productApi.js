import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';


export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page, categoryId }) => `products?page=${page}&categoryId=${categoryId}`,
      providesTags: ['Products'],
    }),
    getProductById: builder.query({
      query: (productId) => `products/${productId}`,
      providesTags: ['Products'],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productApi;
