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
  isResetSuccess: boolean;
};

const initialState: PasswordResetState = {
  isLoading: false,
  error: null,
  isEmailSent: false,
  isResetSuccess: false,
};

const passwordResetSlice = createSlice({
  name: 'passwordReset',
  initialState,
  reducers: {
    resetPasswordResetState: (state) => {
      state.isEmailSent = false;
      state.isResetSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(forgotPasswordRequest, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPasswordSuccess, (state) => {
        state.isLoading = false;
        state.isEmailSent = true;
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
        state.isResetSuccess = true;
        state.error = null;
      })
      .addCase(resetPasswordFailed, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPasswordResetState } = passwordResetSlice.actions;
export default passwordResetSlice.reducer;
