import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom';

import { updateUserRequest, logoutRequest } from '../../services/auth/actions';
import { useAppDispatch, useAppSelector } from '../../services/hooks';

import type { FormEvent } from 'react';

import styles from './profile-page.module.css';

const ProfilePage = (): React.JSX.Element => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isChanged, setIsChanged] = useState(false);
  const [originalData, setOriginalData] = useState<{
    name: string;
    email: string;
    password: string;
  }>({
    name: '',
    email: '',
    password: '',
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading, error } = useAppSelector((state) => ({
    user: state.user.user,
    isLoading: state.auth.isLoading,
    error: state.auth.error,
  }));

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setOriginalData({
        name: user.name,
        email: user.email,
        password: '',
      });
    }
  }, [user]);

  useEffect(() => {
    setIsChanged(
      name !== originalData.name || email !== originalData.email || password !== ''
    );
  }, [name, email, password, originalData]);

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    if (isChanged) {
      const updateData: { name?: string; email?: string; password?: string } = {};
      if (name !== originalData.name) updateData.name = name;
      if (email !== originalData.email) updateData.email = email;
      if (password) updateData.password = password;
      void dispatch(updateUserRequest(updateData));
    }
  };

  const handleCancel = (): void => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
    setPassword('');
  };

  const handleLogout = (): void => {
    void dispatch(logoutRequest());
    navigate('/login', { replace: true });
  };

  const isProfileActive = location.pathname === '/profile';
  const isOrdersActive = location.pathname.startsWith('/profile/orders');

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <nav className={styles.navigation}>
            <NavLink
              to="/profile"
              end
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              <span className="text text_type_main-medium">Профиль</span>
            </NavLink>
            <NavLink
              to="/profile/orders"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              <span className="text text_type_main-medium">История заказов</span>
            </NavLink>
            <button
              type="button"
              className={`${styles.navLink} ${styles.logoutButton}`}
              onClick={handleLogout}
              disabled={isLoading}
            >
              <span className="text text_type_main-medium text_color_inactive">
                Выход
              </span>
            </button>
          </nav>
          <div className={styles.hint}>
            <p className="text text_type_main-default text_color_inactive">
              {isProfileActive &&
                'В этом разделе вы можете изменить свои персональные данные'}
              {isOrdersActive &&
                'В этом разделе вы можете просмотреть свою историю заказов'}
            </p>
          </div>
        </aside>
        <main className={styles.main}>
          {isProfileActive ? (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className="mb-6">
                <Input
                  type="text"
                  placeholder="Имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon="EditIcon"
                  error={false}
                  errorText="Ошибка"
                  size="default"
                  disabled={isLoading}
                />
              </div>
              <div className="mb-6">
                <Input
                  type="email"
                  placeholder="Логин"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon="EditIcon"
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
                  icon="EditIcon"
                  disabled={isLoading}
                />
              </div>
              {error && (
                <div className={`${styles.error} mb-6`}>
                  <p className="text text_type_main-default text_color_error">{error}</p>
                </div>
              )}
              {isChanged && (
                <div className={styles.buttons}>
                  <Button
                    type="secondary"
                    size="medium"
                    htmlType="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    Отмена
                  </Button>
                  <Button
                    type="primary"
                    size="medium"
                    htmlType="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Сохранение...' : 'Сохранить'}
                  </Button>
                </div>
              )}
            </form>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
