import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { WS_CONNECTION_START, WS_DISCONNECT } from '../../services/ws/actions';
import { OrderCard } from '../order-card/order-card';

import type { RootState } from '../../services/store';
import type React from 'react';

import styles from './profile-orders.module.css';

export const ProfileOrders: React.FC = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state: RootState) => state.ws);

  const token = localStorage.getItem('accessToken')?.replace('Bearer ', '').trim() ?? '';

  useEffect(() => {
    if (token) {
      dispatch({ type: WS_CONNECTION_START, payload: `?token=${token}` });
    }
    return () => {
      dispatch({ type: WS_DISCONNECT });
    };
  }, [dispatch, token]);

  if (!token) {
    return (
      <div className={styles.message}>
        <p className="text text_type_main-medium text_color_inactive">
          Необходима авторизация
        </p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className={styles.empty}>
        <p className="text text_type_main-medium text_color_inactive">
          У вас пока нет заказов
        </p>
      </div>
    );
  }

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className={styles.ordersList}>
      {sortedOrders.map((order) => (
        <OrderCard key={order._id} order={order} showStatus={true} />
      ))}
    </div>
  );
};
