import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { forgotPasswordRequest } from '../../services/auth/actions';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { resetPasswordResetState } from '../../services/password-reset/slice';

import type { FormEvent } from 'react';

import styles from './forgot-password-page.module.css';

const ForgotPasswordPage = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, isEmailSent } = useAppSelector(
    (state) => state.passwordReset
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
    void dispatch(resetPasswordResetState());
  }, [dispatch, isAuthenticated, navigate]);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    if (isEmailSent) {
      navigate('/reset-password', {
        state: { from: location },
        replace: true,
      });
    }
  }, [isEmailSent, navigate, location]);

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    if (isValid) {
      void dispatch(forgotPasswordRequest(email));
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
          <Input
            type="email"
            placeholder="Укажите e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {isLoading ? 'Отправка...' : 'Восстановить'}
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

export default ForgotPasswordPage;
