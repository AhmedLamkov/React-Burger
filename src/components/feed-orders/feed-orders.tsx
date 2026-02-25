import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { WS_CONNECTION_START, WS_DISCONNECT } from '../../services/ws/actions';
import { OrderCard } from '../order-card/order-card';

import type { RootState } from '../../services/store';
import type { IWsOrder } from '../../services/ws/types';
import type React from 'react';

import styles from './feed-orders.module.css';

export const FeedOrders: React.FC = () => {
  const dispatch = useDispatch();
  const { orders, total, totalToday } = useSelector((state: RootState) => state.ws);

  useEffect(() => {
    dispatch({ type: WS_CONNECTION_START, payload: '/all' });
    return () => {
      dispatch({ type: WS_DISCONNECT });
    };
  }, [dispatch]);

  if (!orders || orders.length === 0) {
    return (
      <div className={styles.loading}>
        <p className="text text_type_main-medium">Загрузка заказов...</p>
      </div>
    );
  }

  const doneOrders = orders.filter((order) => order.status === 'done').slice(0, 20);
  const pendingOrders = orders
    .filter((order) => order.status === 'pending')
    .slice(0, 20);

  const splitIntoColumns = (ordersArray: IWsOrder[], columnSize = 10): IWsOrder[][] => {
    const columns: IWsOrder[][] = [];
    for (let i = 0; i < ordersArray.length; i += columnSize) {
      columns.push(ordersArray.slice(i, i + columnSize));
    }
    return columns;
  };

  const doneColumns = splitIntoColumns(doneOrders);
  const pendingColumns = splitIntoColumns(pendingOrders);

  return (
    <div className={styles.container}>
      <div className={styles.ordersSection}>
        <h2 className="text text_type_main-large mb-5">Лента заказов</h2>
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      </div>

      <div className={styles.statsSection}>
        <div className={styles.ordersBoard}>
          <div className={styles.ordersColumn}>
            <h3 className="text text_type_main-medium mb-6">Готовы:</h3>
            <div className={styles.columnsContainer}>
              {doneColumns.map((column, idx) => (
                <div key={idx} className={styles.column}>
                  {column.map((order) => (
                    <span
                      key={order._id}
                      className={`${styles.orderNumber} text text_type_digits-default mb-2`}
                      style={{ color: '#00CCCC' }}
                    >
                      {order.number}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.ordersColumn}>
            <h3 className="text text_type_main-medium mb-6">В работе:</h3>
            <div className={styles.columnsContainer}>
              {pendingColumns.map((column, idx) => (
                <div key={idx} className={styles.column}>
                  {column.map((order) => (
                    <span
                      key={order._id}
                      className={`${styles.orderNumber} text text_type_digits-default mb-2`}
                    >
                      {order.number}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.totalOrders}>
          <h3 className="text text_type_main-medium">Выполнено за все время:</h3>
          <span className={`${styles.totalNumber} text text_type_digits-large`}>
            {total}
          </span>
        </div>

        <div className={styles.totalOrders}>
          <h3 className="text text_type_main-medium">Выполнено за сегодня:</h3>
          <span className={`${styles.totalNumber} text text_type_digits-large`}>
            {totalToday}
          </span>
        </div>
      </div>
    </div>
  );
};
