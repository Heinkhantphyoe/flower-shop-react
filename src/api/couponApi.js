import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export const couponApi = createApi({
  reducerPath: 'couponApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Coupons'],
  endpoints: (builder) => ({
    getCoupons: builder.query({
      query: () => 'coupons',
      providesTags: ['Coupons'],
    }),
    applyCoupon: builder.mutation({
      query: ({ code, subtotal }) => ({
        url: 'coupons/apply',
        method: 'POST',
        body: { code, subtotal },
      }),
    }),
    addCoupon: builder.mutation({
      query: (coupon) => ({
        url: 'coupons',
        method: 'POST',
        body: coupon,
      }),
      invalidatesTags: ['Coupons'],
    }),
    updateCoupon: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `coupons/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Coupons'],
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `coupons/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Coupons'],
    }),
  }),
});

export const {
  useGetCouponsQuery,
  useApplyCouponMutation,
  useAddCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponApi;
