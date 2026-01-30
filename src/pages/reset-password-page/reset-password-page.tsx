import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { resetPasswordResetState } from '../../services/password-reset/slice';
import { resetPassword } from '../../services/password-reset/thunk';

import type { FormEvent } from 'react';

import styles from './reset-password-page.module.css';

type LocationState = {
  from?: string;
  testToken?: string;
};

type TokenInfo = {
  email: string;
  issuedAt: string;
  expiresAt: string;
} | null;

const ResetPasswordPage = (): React.JSX.Element => {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [isValid, setIsValid] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as LocationState | undefined;
  const from = locationState?.from;
  const testTokenFromState = locationState?.testToken;

  const {
    isLoading,
    error: resetError,
    isPasswordReset,
  } = useAppSelector((state) => state.passwordReset);

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log('ResetPasswordPage mounted, location.state:', locationState);
    console.log('Test token from state:', testTokenFromState);

    if (!from || from !== '/forgot-password') {
      console.log('Invalid access, redirecting to /forgot-password');
      navigate('/forgot-password', { replace: true });
      return;
    }

    if (isAuthenticated) {
      navigate('/', { replace: true });
    }

    if (testTokenFromState && !token) {
      console.log('Auto-filling token from state');
      setToken(testTokenFromState);
    }

    dispatch(resetPasswordResetState());
  }, [dispatch, isAuthenticated, navigate, from, testTokenFromState, token]);

  useEffect(() => {
    setIsValid(password.length >= 6 && token.length > 0);
  }, [password, token]);

  useEffect(() => {
    if (isPasswordReset) {
      console.log('Password reset successful, redirecting to /login');
      navigate('/login', { replace: true });
    }
  }, [isPasswordReset, navigate]);

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    console.log('Submitting reset password with token:', token);
    if (isValid) {
      void dispatch(resetPassword(password, token));
    }
  };

  const handleBack = (): void => {
    dispatch(resetPasswordResetState());
    navigate('/forgot-password');
  };

  const decodeTestToken = (jwtToken: string): TokenInfo => {
    try {
      const parts = jwtToken.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1])) as {
          email: string;
          iat: number;
          exp: number;
        };
        return {
          email: payload.email,
          issuedAt: new Date(payload.iat).toLocaleString(),
          expiresAt: new Date(payload.exp).toLocaleString(),
        };
      }
    } catch (_error) {
      console.log('Token is not in JWT format');
    }
    return null;
  };

  const tokenInfo = token ? decodeTestToken(token) : null;

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>

        <div className="mb-6">
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            placeholder="Введите новый пароль (минимум 6 символов)"
            disabled={isLoading}
          />
        </div>

        <div className="mb-6">
          <Input
            type="text"
            placeholder="Введите код из письма"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            error={false}
            errorText="Ошибка"
            size="default"
            disabled={isLoading}
          />

          {tokenInfo && (
            <div
              className="mt-4 p-3"
              style={{
                backgroundColor: '#1C1C21',
                borderRadius: '8px',
                border: '1px solid #4C4CFF',
              }}
            >
              <p className="text text_type_main-default">
                <strong>Тестовый токен:</strong>
              </p>
              <p className="text text_type_main-small text_color_inactive mt-1">
                Email: {tokenInfo.email}
              </p>
              <p className="text text_type_main-small text_color_inactive">
                Действителен до: {tokenInfo.expiresAt}
              </p>
              <p className="text text_type_main-small text_color_success mt-2">
                ✓ Используется тестовый токен
              </p>
            </div>
          )}

          {!tokenInfo && token && (
            <p className="text text_type_main-small text_color_inactive mt-2">
              Введен токен: {token.substring(0, 30)}...
            </p>
          )}
        </div>

        {resetError && (
          <div className={`${styles.error} mb-6`}>
            <p className="text text_type_main-default text_color_error">{resetError}</p>
          </div>
        )}

        <div className={styles.buttons}>
          <Button
            type="primary"
            size="medium"
            htmlType="submit"
            disabled={!isValid || isLoading}
          >
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>

          <Button
            type="secondary"
            size="medium"
            htmlType="button"
            onClick={handleBack}
            disabled={isLoading}
          >
            Назад
          </Button>
        </div>

        <div
          className="mt-6 p-4"
          style={{
            backgroundColor: '#1C1C21',
            borderRadius: '8px',
            border: '1px dashed #8585AD',
          }}
        >
          <p className="text text_type_main-default text_color_inactive">
            <strong>Режим тестирования:</strong>
          </p>
          <p className="text text_type_main-small text_color_inactive mt-1">
            • В тестовой среде API не отправляет реальные письма
          </p>
          <p className="text text_type_main-small text_color_inactive">
            • Токен генерируется автоматически
          </p>
          <p className="text text_type_main-small text_color_inactive">
            • Для теста используйте любой пароль (≥6 символов)
          </p>
        </div>
      </form>

      <div className={`${styles.links} mt-20`}>
        <p className="text text_type_main-default text_color_inactive mb-4">
          Вспомнили пароль?{' '}
          <Link to="/login" className={styles.link}>
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
