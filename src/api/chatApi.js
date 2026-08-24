import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    sendChatMessage: builder.mutation({
      query: (message) => ({
        url: 'chat',
        method: 'POST',
        body: { message },
      }),
    }),
    getChatHistory: builder.query({
      query: () => 'chat/history',
    }),
    clearChatHistory: builder.mutation({
      query: () => ({
        url: 'chat/history',
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useSendChatMessageMutation, useGetChatHistoryQuery, useClearChatHistoryMutation } = chatApi;
