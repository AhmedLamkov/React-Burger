import { useEffect } from 'react';

import { FeedOrders } from '../../components/feed-orders/feed-orders';
import { useAppDispatch } from '../../services/hooks';
import { WS_CONNECTION_START, WS_DISCONNECT } from '../../services/ws/actions';

import type React from 'react';

import styles from './feed.module.css';

export const FeedPage: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const relativeUrl = '/all';
    dispatch({ type: WS_CONNECTION_START, payload: relativeUrl });

    return () => {
      dispatch({ type: WS_DISCONNECT, payload: relativeUrl });
    };
  }, [dispatch]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Лента заказов</h1>
        <FeedOrders />
      </div>
    </div>
  );
};
