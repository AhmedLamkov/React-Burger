import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { registerRequest } from '../../services/auth/actions';
import { useAppDispatch, useAppSelector } from '../../services/hooks';

import type { FormEvent } from 'react';

import styles from './register-page.module.css';

const RegisterPage = (): React.JSX.Element => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(
      name.trim().length >= 2 && emailRegex.test(email) && password.length >= 6
    );
  }, [name, email, password]);

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    if (isValid) {
      void dispatch(registerRequest({ name, email, password }));
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Регистрация</h1>
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={false}
            errorText="Ошибка"
            size="default"
            disabled={isLoading}
          />
        </div>
        <div className="mb-6">
          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={false}
            errorText="Ошибка"
            size="default"
            disabled={isLoading}
          />
        </div>
        <div className="mb-6">
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            disabled={isLoading}
          />
        </div>
        {error && (
          <div className={`${styles.error} mb-6`}>
            <p className="text text_type_main-default text_color_error">{error}</p>
          </div>
        )}
        <Button
          type="primary"
          size="medium"
          htmlType="submit"
          disabled={!isValid || isLoading}
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>
      </form>
      <div className={`${styles.links} mt-20`}>
        <p className="text text_type_main-default text_color_inactive mb-4">
          Уже зарегистрированы?{' '}
          <Link to="/login" className={styles.link}>
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
