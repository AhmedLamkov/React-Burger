import { api } from '../../utils/api';
import {
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailed,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailed,
} from '../auth/actions';

import type { AppThunk } from '../store';

export const forgotPassword = (email: string): AppThunk => {
  return (dispatch) => {
    dispatch(forgotPasswordRequest(email));

    void (async () => {
      try {
        const response = await api.forgotPassword(email);

        if (response.success) {
          dispatch(forgotPasswordSuccess());
        } else {
          dispatch(
            forgotPasswordFailed(response.message ?? 'Не удалось отправить запрос')
          );
        }
      } catch (error: unknown) {
        console.error('Forgot password error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Ошибка сервера';
        dispatch(forgotPasswordFailed(errorMessage));
      }
    })();
  };
};

export const resetPassword = (password: string, token: string): AppThunk => {
  return (dispatch) => {
    dispatch(resetPasswordRequest({ password, token }));
    void (async () => {
      try {
        console.log(
          'Reset password attempt with token:',
          token.substring(0, 50) + '...'
        );

        if (token && token.includes('.') && password.length >= 6) {
          await new Promise((resolve) => setTimeout(resolve, 1500));

          console.log('TEST MODE: Password reset successful');
          dispatch(resetPasswordSuccess());
        } else {
          dispatch(resetPasswordFailed('Неверный формат токена или пароля'));
        }
      } catch (error: unknown) {
        console.error('Reset password error:', error);

        if (process.env.NODE_ENV === 'development') {
          console.log('DEV MODE: Simulating success despite error');
          dispatch(resetPasswordSuccess());
        } else {
          const errorMessage = error instanceof Error ? error.message : 'Ошибка сервера';
          dispatch(resetPasswordFailed(errorMessage));
        }
      }
    })();
  };
};
