import { createSlice } from '@reduxjs/toolkit';

import {
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailed,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailed,
} from '../auth/actions';

type PasswordResetState = {
  isLoading: boolean;
  error: string | null;
  isEmailSent: boolean;
  isPasswordReset: boolean;
};

const initialState: PasswordResetState = {
  isLoading: false,
  error: null,
  isEmailSent: false,
  isPasswordReset: false,
};

const passwordResetSlice = createSlice({
  name: 'passwordReset',
  initialState,
  reducers: {
    resetPasswordResetState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.isEmailSent = false;
      state.isPasswordReset = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(forgotPasswordRequest, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isEmailSent = false;
      })
      .addCase(forgotPasswordSuccess, (state) => {
        state.isLoading = false;
        state.isEmailSent = true;
        state.error = null;
      })
      .addCase(forgotPasswordFailed, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isEmailSent = false;
      })
      .addCase(resetPasswordRequest, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isPasswordReset = false;
      })
      .addCase(resetPasswordSuccess, (state) => {
        state.isLoading = false;
        state.isPasswordReset = true;
        state.error = null;
      })
      .addCase(resetPasswordFailed, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isPasswordReset = false;
      });
  },
});

export const { resetPasswordResetState } = passwordResetSlice.actions;
export default passwordResetSlice.reducer;
