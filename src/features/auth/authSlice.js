// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Get user from localStorage
const storedUser = JSON.parse(localStorage.getItem('user'));

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data;

      if (data.success && data.data.token) {
        const user = {
          token: data.data.token,
          role: data.data.role,
          email,
          isAuthenticated: true,
        };

        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(user));

        return user;
      } else {
        return rejectWithValue(data.message || 'Login failed');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login error'
      );
    }
  }
);


//Register user
export const register = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Registration failed');
    }
  }
);

// OTP Verification
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, finalOtp }, { rejectWithValue }) => { 
    console.log(`Verifying OTP for hahahhahahahahha: ${email} with code: ${finalOtp}`);
       
    try {
      const response = await api.post('/auth/verify-otp', { email, otp:finalOtp });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'OTP verification error'
      );
    }
  }
);

// OTP Verification
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }, { rejectWithValue }) => { 
       
    try {
      const response = await api.post('/auth/forgot-password', { email});
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Forgot password error'
      );
    }
  }
);

//Verfify Reset Token
export const verifyResetToken = createAsyncThunk(
  'auth/verifyResetToken',
  async ({ token }, { rejectWithValue }) => { 
         console.log("verifyResetToken called",token)

    try {      
      const response = await api.post('/auth/verify-reset-token', { token});
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'VerifyResetPassword error'
      );
    }
  }
);


// Reset Password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token,newPassword }, { rejectWithValue }) => { 
       
    try {
      const response = await api.post('/auth/reset-password', { token,newPassword});
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'ResetPassword error'
      );
    }
  }
);






// Initial state
const initialState = {
  user: storedUser || null,
  isAuthenticated: storedUser?.isAuthenticated || false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('user');
      localStorage.removeItem('registeredEmail');// saving in otp send
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
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
        state.isAuthenticated = false;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(verifyResetToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyResetToken.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(verifyResetToken.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });

  },
});

export const { logout, loginSuccess } = authSlice.actions;
export default authSlice.reducer;
