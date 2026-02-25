import { formatDate } from '@/utils/date';
import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import type { RootState } from '../../services/store';
import type { IWsOrder } from '../../services/ws/types';
import type { TIngredient } from '../../utils/types';
import type React from 'react';

import styles from './order-card.module.css';

type IOrderCardProps = {
  order: IWsOrder;
  showStatus?: boolean;
};

export const OrderCard: React.FC<IOrderCardProps> = ({ order, showStatus = false }) => {
  const location = useLocation();
  const { items } = useSelector((state: RootState) => state.ingredients);

  const orderIngredients = order.ingredients
    .map((id: string) => items.find((item: TIngredient) => item._id === id))
    .filter((item): item is TIngredient => item !== undefined);

  const totalPrice = orderIngredients.reduce((sum, item) => sum + item.price, 0);

  const visibleIngredients = orderIngredients.slice(0, 6);
  const remainingCount = orderIngredients.length - 6;

  const getStatusText = (status: string): { text: string; color: string } => {
    switch (status) {
      case 'done':
        return { text: 'Выполнен', color: '#00CCCC' };
      case 'pending':
        return { text: 'Готовится', color: '#F2F2F3' };
      case 'created':
        return { text: 'Создан', color: '#F2F2F3' };
      default:
        return { text: 'Отменен', color: '#E52B1A' };
    }
  };

  const statusInfo = getStatusText(order.status);

  const getOrderPath = () => {
    if (location.pathname.includes('/profile/orders')) {
      return {
        pathname: `/profile/orders/${order.number}`,
        state: { background: location },
      };
    }
    return {
      pathname: `/feed/${order.number}`,
      state: { background: location },
    };
  };

  return (
    <Link to={getOrderPath()} className={styles.link}>
      <div className={`${styles.card} p-6`}>
        <div className={styles.header}>
          <span className="text text_type_digits-default">#{order.number}</span>
          <span className="text text_type_main-default text_color_inactive">
            {formatDate(order.createdAt)}
          </span>
        </div>

        <h3 className={`${styles.title} text text_type_main-medium mt-6`}>
          {order.name}
        </h3>

        {showStatus && (
          <p
            className="text text_type_main-default mt-2"
            style={{ color: statusInfo.color }}
          >
            {statusInfo.text}
          </p>
        )}

        <div className={`${styles.footer} mt-6`}>
          <div className={styles.ingredients}>
            {visibleIngredients.map((item, index) => (
              <div
                key={index}
                className={styles.ingredientIcon}
                style={{ zIndex: visibleIngredients.length - index }}
              >
                <img src={item.image} alt={item.name} />
                {index === 5 && remainingCount > 0 && (
                  <div className={styles.remainingCount}>+{remainingCount}</div>
                )}
              </div>
            ))}
          </div>
          <div className={styles.price}>
            <span className="text text_type_digits-default">{totalPrice}</span>
            <CurrencyIcon type="primary" />
          </div>
        </div>
      </div>
    </Link>
  );
};
