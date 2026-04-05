import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/authSlice';
import { authApi } from '../api/authApi';
import { productApi } from '../api/productApi';
import { cartApi } from '../api/cartApi';
import { orderApi } from '../api/orderApi';


const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(productApi.middleware)
      .concat(cartApi.middleware)
      .concat(orderApi.middleware),
});

export default store;
