import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: (params) => ({
        url: 'orders',
        params,
      }),
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
    updateOrderStatus: builder.mutation({
      query: ({ orderId, orderStatus }) => ({
        url: `orders/${orderId}/status`,
        method: 'PUT',
        body: { orderStatus },
      }),
      invalidatesTags: ['Order'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate Analytics cache from this separate Api slice
          const { analyticApi } = await import('./analyticApi');
          dispatch(analyticApi.util.invalidateTags(['Analytics']));
        } catch {}
      }
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
  useUpdateOrderStatusMutation,
} = orderApi;
