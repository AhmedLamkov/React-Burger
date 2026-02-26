import { useAppSelector } from '../../services/hooks';
import { OrderCard } from '../order-card/order-card';

import type { RootState } from '../../services/store';
import type { IWsOrder } from '../../services/ws/types';
import type React from 'react';

import styles from './profile-orders.module.css';

export const ProfileOrders: React.FC = () => {
  const { orders } = useAppSelector((state: RootState) => state.ws);

  const token = localStorage.getItem('accessToken')?.replace('Bearer ', '').trim() ?? '';

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
    (a: IWsOrder, b: IWsOrder) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className={styles.ordersList}>
      {sortedOrders.map((order: IWsOrder) => (
        <OrderCard key={order._id} order={order} showStatus={true} />
      ))}
    </div>
  );
};
