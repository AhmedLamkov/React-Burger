import { createAction } from '@reduxjs/toolkit';

import type { IUser } from '../../utils/types';

export const registerRequest = createAction<{
  name: string;
  email: string;
  password: string;
}>('auth/registerRequest');
export const registerSuccess = createAction<{
  user: IUser;
  accessToken: string;
  refreshToken: string;
}>('auth/registerSuccess');
export const registerFailed = createAction<string>('auth/registerFailed');

export const loginRequest = createAction<{ email: string; password: string }>(
  'auth/loginRequest'
);
export const loginSuccess = createAction<{
  user: IUser;
  accessToken: string;
  refreshToken: string;
}>('auth/loginSuccess');
export const loginFailed = createAction<string>('auth/loginFailed');

export const logoutRequest = createAction('auth/logoutRequest');
export const logoutSuccess = createAction('auth/logoutSuccess');
export const logoutFailed = createAction<string>('auth/logoutFailed');

export const getUserRequest = createAction('auth/getUserRequest');
export const getUserSuccess = createAction<{ user: IUser }>('auth/getUserSuccess');
export const getUserFailed = createAction<string>('auth/getUserFailed');

export const updateUserRequest = createAction<{
  name?: string;
  email?: string;
  password?: string;
}>('auth/updateUserRequest');
export const updateUserSuccess = createAction<{ user: IUser }>('auth/updateUserSuccess');
export const updateUserFailed = createAction<string>('auth/updateUserFailed');

export const setAuthChecked = createAction<boolean>('auth/setAuthChecked');

export const forgotPasswordRequest = createAction<string>('auth/forgotPasswordRequest');
export const forgotPasswordSuccess = createAction('auth/forgotPasswordSuccess');
export const forgotPasswordFailed = createAction<string>('auth/forgotPasswordFailed');

export const resetPasswordRequest = createAction<{ password: string; token: string }>(
  'auth/resetPasswordRequest'
);
export const resetPasswordSuccess = createAction('auth/resetPasswordSuccess');
export const resetPasswordFailed = createAction<string>('auth/resetPasswordFailed');
