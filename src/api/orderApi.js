import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => 'orders',
      providesTags: ['Order'],
    }),
    getOrder: builder.query({
      query: (orderId) => `orders/${orderId}`,
      providesTags: ['Order'],
    }),
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: 'orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order', 'Cart'],
    }),
    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `orders/${orderId}/cancel`,
        method: 'PUT',
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
} = orderApi;
