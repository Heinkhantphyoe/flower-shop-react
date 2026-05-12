import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/authSlice';
import { authApi } from '../api/authApi';
import { productApi } from '../api/productApi';
import { cartApi } from '../api/cartApi';
import { orderApi } from '../api/orderApi';
import { categoryApi } from '../api/categoryApi';
import { wishlistApi } from '../api/wishlistApi';
import { analyticApi } from '../api/analyticApi';

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [wishlistApi.reducerPath]: wishlistApi.reducer,
    [analyticApi.reducerPath]: analyticApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(productApi.middleware)
      .concat(cartApi.middleware)
      .concat(orderApi.middleware)
      .concat(categoryApi.middleware)
      .concat(wishlistApi.middleware)
      .concat(analyticApi.middleware),
});

export default store;
