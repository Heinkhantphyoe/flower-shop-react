import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const cartApi = createApi({
    reducerPath: 'cartApi',
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
    tagTypes: ['Cart'],
    endpoints: (builder) => ({
        //Fetch user's cart
        getCart: builder.query({
            query: () => `carts`,
            providesTags: ['Cart'],
        }),

        //Add product to cart
        addToCart: builder.mutation({
            query: ({ productId, quantity }) => ({
                url: `carts/add`,
                method: 'POST',
                params: { productId, quantity },
            }),
            invalidatesTags: ['Cart'],
        }),

        // Update cart item quantity
        updateCartItem: builder.mutation({
            query: ({ cartItemId, quantity }) => ({
                url: `carts/update`,
                method: 'PUT',
                params: { cartItemId, quantity },
            }),
            invalidatesTags: ['Cart'],
        }),

        // Remove item from cart
        removeCartItem: builder.mutation({
            query: ({ cartItemId }) => ({
                url: `carts/remove`,
                method: 'DELETE',
                params: { cartItemId },
            }),
            invalidatesTags: ['Cart'],
        }),

        //  Clear cart
        clearCart: builder.mutation({
            query: () => ({
                url: `carts/clear`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Cart'],
        }),
    }),
});

export const {
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateCartItemMutation,
    useRemoveCartItemMutation,
    useClearCartMutation,
} = cartApi;
