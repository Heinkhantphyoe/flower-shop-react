import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/AuthSlice';
import { authApi } from '../features/auth/authApi';
import { productApi } from '../features/product/productApi';


const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware)
                          .concat(productApi.middleware),
});

export default store;
