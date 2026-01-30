import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { resetPasswordRequest } from '../../services/auth/actions';
import { useAppDispatch, useAppSelector } from '../../services/hooks';

import type { FormEvent } from 'react';

import styles from './reset-password-page.module.css';

type LocationState = {
  fromForgotPassword?: boolean;
  from?: Location;
};

const ResetPasswordPage = (): React.JSX.Element => {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [isValid, setIsValid] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, isResetSuccess } = useAppSelector(
    (state) => state.passwordReset
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
    const state = location.state as LocationState | null;
    if (!state?.fromForgotPassword) {
      navigate('/forgot-password', { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    setIsValid(password.length >= 6 && token.trim().length > 0);
  }, [password, token]);

  useEffect(() => {
    if (isResetSuccess) {
      navigate('/login', { replace: true });
    }
  }, [isResetSuccess, navigate]);

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    if (isValid) {
      void dispatch(resetPasswordRequest({ password, token }));
    }
  };

  const handleCancel = (): void => {
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>
        <div className="mb-6">
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            placeholder="Введите новый пароль"
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
        </div>
        {error && (
          <div className={`${styles.error} mb-6`}>
            <p className="text text_type_main-default text_color_error">{error}</p>
          </div>
        )}
        <div className={`${styles.buttons} mb-20`}>
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
            onClick={handleCancel}
            disabled={isLoading}
          >
            Отмена
          </Button>
        </div>
      </form>
      <div className={`${styles.links}`}>
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
