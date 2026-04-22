import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export const wishlistApi = createApi({
  reducerPath: 'wishlistApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Wishlist'],
  endpoints: (builder) => ({
    getWishlists: builder.query({
      query: () => `wishlists`,
      providesTags: ['Wishlist'],
    }),
    checkIsWishlisted: builder.query({
      query: (productId) => `wishlists/${productId}/is-wishlisted`,
      providesTags: (result, error, productId) => [
        { type: 'Wishlist', id: productId },
        { type: 'Wishlist', id: 'LIST' } // Link it to the list as well
      ],
    }),
    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: `wishlists/${productId}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, productId) => [
        'Wishlist', 
        { type: 'Wishlist', id: productId }
      ],
    }),
    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `wishlists/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, productId) => [
        'Wishlist', 
        { type: 'Wishlist', id: productId }
      ],
    }),
    toggleWishlist: builder.mutation({
      query: (productId) => ({
        url: `wishlists/${productId}/toggle`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, productId) => [
        'Wishlist', 
        { type: 'Wishlist', id: productId }
      ],
    }),
    moveToCart: builder.mutation({
      query: ({ wishlistId, quantity = 1 }) => ({
        url: `wishlists/move-to-cart/${wishlistId}`,
        method: 'POST',
        body: { quantity },
      }),
      // We also want to invalidate Cart since it modifies the cart
      invalidatesTags: ['Wishlist', 'Cart'],
    }),
    clearWishlist: builder.mutation({
      query: () => ({
        url: `wishlists/clear`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Wishlist'],
    }),
  }),
});

export const {
  useGetWishlistsQuery,
  useCheckIsWishlistedQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useToggleWishlistMutation,
  useMoveToCartMutation,
  useClearWishlistMutation,
} = wishlistApi;
