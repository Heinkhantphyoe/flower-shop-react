import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';


export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page, categoryId, stockFilterId }) => {
        let url = `products?page=${page}`;
        if (categoryId) url += `&categoryId=${categoryId}`;
        if (stockFilterId) url += `&stockFilterId=${stockFilterId}`;
        return url;
      },
      providesTags: ['Products'],
    }),
    getProductById: builder.query({
      query: (productId) => `products/${productId}`,
      providesTags: ['Products'],
    }),
    getCategories: builder.query({
      query: () => 'categories',
    }),
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: 'products',
        method: 'POST',
        body: newProduct,
      }),
      invalidatesTags: ['Products'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery, useGetCategoriesQuery, useAddProductMutation, useUpdateProductMutation, useDeleteProductMutation } = productApi;
