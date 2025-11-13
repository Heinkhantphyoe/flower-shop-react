import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { authApi } from '../features/auth/authApi';
import { productApi } from '../features/product/productApi';
import { cartApi } from '../features/product/cartApi';
import { orderApi } from '../features/order/orderApi';


const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware)
                          .concat(productApi.middleware)
                          .concat(cartApi.middleware)
                          .concat(orderApi.middleware),
});

export default store;
