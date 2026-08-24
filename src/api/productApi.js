import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';


export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page, categoryId, stockFilterId, name, minPrice, maxPrice, sortBy, sortOrder }) => {
        let url = `products?page=${page}`;
        if (categoryId) url += `&categoryId=${categoryId}`;
        if (stockFilterId) url += `&stockFilterId=${stockFilterId}`;
        if (name) url += `&name=${encodeURIComponent(name)}`;
        if (minPrice !== undefined && minPrice !== null && minPrice !== '') url += `&minPrice=${minPrice}`;
        if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') url += `&maxPrice=${maxPrice}`;
        if (sortBy) url += `&sortBy=${sortBy}`;
        if (sortOrder) url += `&sortOrder=${sortOrder}`;
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
