import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout, loginSuccess } from '../redux/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // ALWAYS USE REDUX STATE FOR HEADERS, NOT LOCALSTORAGE
    // Redux updates instantly, localStorage is slower causing race-condition 401s
    const token = getState()?.auth?.user?.token;
    
    // Do not overwrite existing Authorization header (allows refresh request to override it)
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const userState = api.getState()?.auth?.user;
    const refreshToken = userState?.refreshToken;

    // PREVENT INFINITE REFRESH LOOPS AND CHECK IF WE EVEN HAVE A REFRESH TOKEN
    if (!refreshToken || args.url === '/auth/refresh') {
       api.dispatch(logout());
       return result;
    }

    // Try to get a new token - sending refreshToken in body
    // and explicitly omitting the expired access token from header
    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh', 
        method: 'POST',
        headers: {
          // Explicitly clear or override the authorization header so the backend 
          // doesn't block the request because of the expired access token
          'Authorization': `Bearer ${refreshToken}`
        },
        body: { refreshToken }, 
      },
      api,
      extraOptions
    );

    if (refreshResult.data && refreshResult.data.data && refreshResult.data.data.accessToken) {
      // 3️ UPDATE NEW TOKENS
      const updatedUser = {
        ...userState,
        token: refreshResult.data.data.accessToken,
        refreshToken: refreshResult.data.data.refreshToken,
      };
      
      api.dispatch(loginSuccess(updatedUser));

      // Retry original request automatically
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Token expired, clear data and log out
      api.dispatch(logout());
    }
  }

  return result;
};