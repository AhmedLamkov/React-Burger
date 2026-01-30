import { createSlice } from '@reduxjs/toolkit';

import {
  registerSuccess,
  loginSuccess,
  getUserSuccess,
  updateUserSuccess,
  logoutSuccess,
} from '../auth/actions';

import type { IUser } from '../../utils/types';

type UserState = {
  user: IUser | null;
};

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerSuccess, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(loginSuccess, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(getUserSuccess, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(updateUserSuccess, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(logoutSuccess, (state) => {
        state.user = null;
      });
  },
});

export default userSlice.reducer;
