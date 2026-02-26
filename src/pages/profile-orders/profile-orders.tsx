import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import { ProfileOrders } from '../../components/profile-orders/profile-orders';
import { useAppDispatch } from '../../services/hooks';
import { WS_CONNECTION_START, WS_DISCONNECT } from '../../services/ws/actions';

import type React from 'react';

import styles from './profile-orders.module.css';

export const ProfileOrdersPage: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken')?.replace('Bearer ', '').trim();
    if (token) {
      const relativeUrl = `?token=${token}`;
      dispatch({ type: WS_CONNECTION_START, payload: relativeUrl });

      return () => {
        dispatch({ type: WS_DISCONNECT, payload: relativeUrl });
      };
    }
  }, [dispatch]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <h2 className={styles.mobileTitle}>История заказов</h2>
          <nav className={styles.nav}>
            <NavLink
              to="/profile"
              end
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
            >
              <span className="text text_type_main-medium">Профиль</span>
            </NavLink>

            <NavLink
              to="/profile/orders"
              end
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
            >
              <span className="text text_type_main-medium">История заказов</span>
            </NavLink>

            <NavLink
              to="/logout"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
            >
              <span className="text text_type_main-medium text_color_inactive">
                Выход
              </span>
            </NavLink>
          </nav>
          <p
            className={`${styles.description} text text_type_main-default text_color_inactive`}
          >
            В этом разделе вы можете просмотреть свою историю заказов
          </p>
        </div>
        <div className={styles.content}>
          <ProfileOrders />
        </div>
      </div>
    </div>
  );
};
