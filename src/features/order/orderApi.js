import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const orderApi = createApi({
    reducerPath: 'orderApi',
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
    tagTypes: ['Order'],
    endpoints: (builder) => ({
        // Get all orders for the user
        getOrders: builder.query({
            query: () => 'orders',
            providesTags: ['Order'],
        }),

        // Get single order details
        getOrder: builder.query({
            query: (orderId) => `orders/${orderId}`,
            providesTags: ['Order'],
        }),

        // Create new order by customer
        createOrder: builder.mutation({
            query: (orderData) => ({
                url: 'orders',
                method: 'POST',
                body: orderData,
            }),
            invalidatesTags: ['Order', 'Cart'],
        }),

        // Cancel order
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
