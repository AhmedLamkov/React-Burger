import { FeedOrders } from '../../components/feed-orders/feed-orders';

import type React from 'react';

import styles from './feed.module.css';

export const FeedPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Лента заказов</h1>
        <FeedOrders />
      </div>
    </div>
  );
};
