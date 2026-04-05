import { createSlice } from "@reduxjs/toolkit";

const storedUser = JSON.parse(localStorage.getItem('user'));

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser || null,
    isAuthenticated: storedUser?.isAuthenticated || false,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('user');
      localStorage.removeItem('registeredEmail');
      localStorage.removeItem('cartItems');
      state.user = null;
      state.isAuthenticated = false;
    },
    loginSuccess: (state, action) => {
      const user = { ...action.payload, isAuthenticated: true };
      state.user = user;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(user));
    },
  },
});

export const { logout, loginSuccess } = authSlice.actions;
export default authSlice.reducer;
