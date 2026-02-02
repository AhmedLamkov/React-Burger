import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { resetPasswordResetState } from '../../services/password-reset/slice';
import { forgotPassword } from '../../services/password-reset/thunk';

import type { FormEvent } from 'react';

import styles from './forgot-password-page.module.css';

const ForgotPasswordPage = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false);

  const { isLoading, error, isEmailSent } = useAppSelector(
    (state) => state.passwordReset
  );

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log('ForgotPasswordPage mounted');

    if (isAuthenticated) {
      navigate('/', { replace: true });
    }

    dispatch(resetPasswordResetState());
    hasRedirected.current = false;

    return () => {
      hasRedirected.current = false;
    };
  }, [dispatch, isAuthenticated, navigate]);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    console.log('isEmailSent changed:', isEmailSent);

    if (isEmailSent && !hasRedirected.current) {
      console.log('Redirecting to /reset-password');
      hasRedirected.current = true;

      const testToken = generateTestToken(email);
      console.log('Generated test token:', testToken);

      navigate('/reset-password', {
        state: {
          from: location.pathname,
          testToken: testToken,
        },
        replace: true,
      });
    }
  }, [isEmailSent, navigate, location.pathname, email]);

  const generateTestToken = (userEmail: string): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        email: userEmail,
        iat: Date.now(),
        exp: Date.now() + 3600000,
      })
    );
    const signature = 'test-signature-' + Date.now();

    return `${header}.${payload}.${signature}`;
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    if (isValid) {
      void dispatch(forgotPassword(email));
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
