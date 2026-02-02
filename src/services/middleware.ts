import { api } from '../utils/api';
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
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailed,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailed,
} from './auth/actions';

import type { Middleware } from '@reduxjs/toolkit';

export const authMiddleware: Middleware = (store) => (next) => async (action) => {
  next(action);

  if (registerRequest.match(action)) {
    const { name, email, password } = action.payload;
    try {
      const data = await api.register(name, email, password);

      localStorage.setItem('accessToken', data.accessToken.replace('Bearer ', ''));
      localStorage.setItem('refreshToken', data.refreshToken);

      store.dispatch(
        registerSuccess({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        })
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      store.dispatch(registerFailed(errorMessage));
    }
  }

  if (loginRequest.match(action)) {
    const { email, password } = action.payload;
    try {
      const data = await api.login(email, password);

      localStorage.setItem('accessToken', data.accessToken.replace('Bearer ', ''));
      localStorage.setItem('refreshToken', data.refreshToken);

      store.dispatch(
        loginSuccess({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        })
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      store.dispatch(loginFailed(errorMessage));
    }
  }

  if (logoutRequest.match(action)) {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.logout(refreshToken);
      }

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      store.dispatch(logoutSuccess());
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      store.dispatch(logoutFailed(errorMessage));
    }
  }

  if (getUserRequest.match(action)) {
    try {
      const data = await api.getUser();
      store.dispatch(getUserSuccess({ user: data.user }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      const isAuthError =
        errorMessage.includes('401') ||
        errorMessage.includes('jwt') ||
        errorMessage.includes('token') ||
        errorMessage.includes('Unauthorized') ||
        errorMessage.includes('authorised') ||
        errorMessage.includes('authorized') ||
        errorMessage.includes('auth');

      if (isAuthError) {
        console.log('Middleware: Authentication error detected');

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            const tokenData = await api.refreshToken(refreshToken);

            localStorage.setItem(
              'accessToken',
              tokenData.accessToken.replace('Bearer ', '')
            );
            localStorage.setItem('refreshToken', tokenData.refreshToken);

            console.log('Middleware: Token refreshed, retrying getUser...');

            const userData = await api.getUser();
            store.dispatch(getUserSuccess({ user: userData.user }));
            return;
          }
        } catch (refreshError: unknown) {
          console.error('Middleware: Token refresh failed', refreshError);
        }

        store.dispatch(getUserFailed(errorMessage));

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } else {
        store.dispatch(getUserFailed(errorMessage));
      }
    }
  }

  if (updateUserRequest.match(action)) {
    try {
      const data = await api.updateUser(action.payload);
      store.dispatch(updateUserSuccess({ user: data.user }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      store.dispatch(updateUserFailed(errorMessage));
    }
  }

  if (forgotPasswordRequest.match(action)) {
    try {
      await api.forgotPassword(action.payload);
      store.dispatch(forgotPasswordSuccess());
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      store.dispatch(forgotPasswordFailed(errorMessage));
    }
  }

  if (resetPasswordRequest.match(action)) {
    const { password, token } = action.payload;
    try {
      await api.resetPassword(password, token);
      store.dispatch(resetPasswordSuccess());
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      store.dispatch(resetPasswordFailed(errorMessage));
    }
  }
};
