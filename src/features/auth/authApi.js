import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl:  import.meta.env.VITE_API_BASE_URL, 
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: '/auth/login',
        method: 'POST',
        body: { email, password },
      }),
      transformResponse: (response, meta, arg) => {
        if (response.success && response.data.token) {
          const user = {
            token: response.data.token,
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
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyOtpMutation,
  useForgotPasswordMutation,
  useVerifyResetTokenMutation,
  useResetPasswordMutation,
} = authApi;
