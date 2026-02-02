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
} from './actions';

type AuthState = {
  user: { email: string; name: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isAuthChecked: boolean;
  accessToken: string | null;
  refreshToken: string | null;
};

const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');

const initialState: AuthState = {
  user: null,
  isAuthenticated: !!accessToken, // Устанавливаем true если токен есть
  isLoading: false,
  error: null,
  isAuthChecked: false,
  accessToken: accessToken,
  refreshToken: refreshToken,
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
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
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
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
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
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(logoutFailed, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getUserRequest, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserSuccess, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(getUserFailed, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = action.payload; // Используем переданное сообщение об ошибке
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(updateUserRequest, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserSuccess, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(updateUserFailed, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(setAuthChecked, (state, action) => {
        state.isAuthChecked = action.payload;
      });
  },
});

export default authSlice.reducer;
