import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { loginRequest } from '../../services/auth/actions';
import { useAppDispatch, useAppSelector } from '../../services/hooks';

import type { FormEvent } from 'react';

import styles from './login-page.module.css';

type LocationState = {
  from?: string | { pathname: string };
};

const LoginPage = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const state = location.state as LocationState | null;

  const getFromPath = (): string => {
    if (!state?.from) return '/';

    if (typeof state.from === 'string') {
      return state.from;
    }

    if (typeof state.from === 'object' && state.from.pathname) {
      return state.from.pathname;
    }

    return '/';
  };

  const from = getFromPath();

  useEffect(() => {
    if (isAuthenticated) {
      console.log('Login successful, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailRegex.test(email) && password.length >= 6);
  }, [email, password]);

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    if (isValid) {
      void dispatch(loginRequest({ email, password }));
    }
  };

  return (
    <div className={styles.container} data-testid="login-page">
      <form className={styles.form} onSubmit={handleSubmit} data-testid="login-form">
        <h1 className="text text_type_main-medium mb-6">Вход</h1>
        <div className="mb-6" data-testid="email-input-container">
          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={false}
            errorText="Ошибка"
            size="default"
            disabled={isLoading}
            data-testid="email-input"
          />
        </div>
        <div className="mb-6" data-testid="password-input-container">
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            disabled={isLoading}
            data-testid="password-input"
          />
        </div>
        {error && (
          <div className={`${styles.error} mb-6`} data-testid="login-error">
            <p className="text text_type_main-default text_color_error">{error}</p>
          </div>
        )}
        <Button
          type="primary"
          size="medium"
          htmlType="submit"
          disabled={!isValid || isLoading}
          data-testid="login-submit-button"
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </Button>
      </form>
      <div className={`${styles.links} mt-20`}>
        <p className="text text_type_main-default text_color_inactive mb-4">
          Вы - новый пользователь?{' '}
          <Link to="/register" className={styles.link} data-testid="register-link">
            Зарегистрироваться
          </Link>
        </p>
        <p className="text text_type_main-default text_color_inactive">
          Забыли пароль?{' '}
          <Link
            to="/forgot-password"
            className={styles.link}
            data-testid="forgot-password-link"
          >
            Восстановить пароль
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
