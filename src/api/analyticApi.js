import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export const analyticApi = createApi({
  reducerPath: 'analyticApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Analytics'],
  endpoints: (builder) => ({
    getAnalyticsSummary: builder.query({
      query: (params) => ({
        url: 'admin/analytics/summary',
        params, // to pass e.g. timeFilter
      }),
      providesTags: ['Analytics'],
    }),
  }),
});

export const { useGetAnalyticsSummaryQuery } = analyticApi;
