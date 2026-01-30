import { createSlice } from '@reduxjs/toolkit';

import {
  registerRequest,
  registerSuccess,
  registerFailed,
  loginRequest,
  loginSuccess,
  loginFailed,
  logoutRequest,
  logoutSuccess,
  logoutFailed,
  getUserRequest,
  getUserSuccess,
  getUserFailed,
  updateUserRequest,
  updateUserSuccess,
  updateUserFailed,
  setAuthChecked,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailed,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailed,
} from './actions';

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isAuthChecked: boolean;
  accessToken: string | null;
  refreshToken: string | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isAuthChecked: false,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerRequest, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerSuccess, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken.replace('Bearer ', '');
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(registerFailed, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(loginRequest, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginSuccess, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken.replace('Bearer ', '');
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(loginFailed, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logoutRequest, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutSuccess, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = null;
      })
      .addCase(logoutFailed, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getUserRequest, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserSuccess, (state) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getUserFailed, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(updateUserRequest, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserSuccess, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateUserFailed, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(forgotPasswordRequest, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPasswordSuccess, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPasswordFailed, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(resetPasswordRequest, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPasswordSuccess, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPasswordFailed, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(setAuthChecked, (state, action) => {
        state.isAuthChecked = action.payload;
      });
  },
});

export default authSlice.reducer;
