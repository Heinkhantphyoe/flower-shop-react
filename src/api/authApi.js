import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: '/auth/login',
        method: 'POST',
        body: { email, password },
      }),
      transformResponse: (response, meta, arg) => {
        if (response.success && response.data.accessToken) {
          const user = {
            token: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            role: response.data.role,
            email: arg.email,
            isAuthenticated: true,
          };
          return user;
        } else {
          throw new Error(response.message || 'Login failed');
        }
      },
    }),
    register: builder.mutation({
      query: (formData) => ({
        url: '/auth/register',
        method: 'POST',
        body: formData,
      }),
    }),
    verifyOtp: builder.mutation({
      query: ({ email, finalOtp }) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: { email, otp: finalOtp },
      }),
    }),
    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),
    verifyResetToken: builder.mutation({
      query: ({ token }) => ({
        url: '/auth/verify-reset-token',
        method: 'POST',
        body: { token },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: { token, newPassword },
      }),
    }),
    getMe: builder.query({
      query: () => ({
        url: '/users/me',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    updateMe: builder.mutation({
      query: (data) => ({
        url: '/users/me',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyOtpMutation,
  useForgotPasswordMutation,
  useVerifyResetTokenMutation,
  useResetPasswordMutation,
  useGetMeQuery,
  useUpdateMeMutation,
} = authApi;
