import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { NavLink, useLocation } from 'react-router-dom';

import { useAppSelector } from '../../services/hooks';

import styles from './app-header.module.css';

export const AppHeader = (): React.JSX.Element => {
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
            end
          >
            <BurgerIcon type={location.pathname === '/' ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2">Конструктор</p>
          </NavLink>

          <NavLink
            to="/feed"
            className={({ isActive }) =>
              `${styles.link} ml-10 ${isActive ? styles.link_active : ''}`
            }
          >
            <ListIcon
              type={location.pathname.startsWith('/feed') ? 'primary' : 'secondary'}
            />
            <p className="text text_type_main-default ml-2">Лента заказов</p>
          </NavLink>
        </div>

        <div className={styles.logo}>
          <NavLink to="/">
            <Logo />
          </NavLink>
        </div>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${styles.link} ${styles.link_position_last} ${isActive ? styles.link_active : ''}`
          }
        >
          <ProfileIcon
            type={location.pathname.startsWith('/profile') ? 'primary' : 'secondary'}
          />
          <p className="text text_type_main-default ml-2">
            {isAuthenticated ? 'Личный кабинет' : 'Войти'}
          </p>
        </NavLink>
      </nav>
    </header>
  );
};
