import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    console.log(response)
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const resetPassword = createAsyncThunk('auth/reset', async (email, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, { email });
    return response.data.message;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null, isLoading: false, error: null },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
    },
    clearError:(state)=>{
      state.error=null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        console.log(action.payload)
        localStorage.setItem("JWT",action.payload.token)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error=action.payload.errors
        console.log(action.payload.errors)
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state,action) => {
        state.isLoading = false;
        console.log(action.payload)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error=action.payload.errors
        console.log(action.payload.errors)
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
      });
  },
});

export const { logout,clearError } = authSlice.actions;
export default authSlice.reducer;
