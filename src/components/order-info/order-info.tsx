import { formatDate } from '@/utils/date';
import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAppSelector } from '../../services/hooks';
import { api } from '../../utils/api';

import type { IWsOrder } from '../../services/ws/types';
import type { TIngredient } from '../../utils/types';
import type React from 'react';

import styles from './order-info.module.css';

export const OrderInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders } = useAppSelector((state) => state.ws);
  const { items } = useAppSelector((state) => state.ingredients);
  const [order, setOrder] = useState<IWsOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);

      if (orders?.length && id) {
        const numericId = parseInt(id, 10);
        if (!isNaN(numericId)) {
          const foundOrder = orders.find(
            (order: IWsOrder) => order.number === numericId
          );
          if (foundOrder) {
            setOrder(foundOrder);
            setIsLoading(false);
            return;
          }
        }
      }

      try {
        if (id) {
          const foundOrder = await api.getOrderByNumber(id);
          setOrder(foundOrder);
        }
      } catch (error) {
        console.error('Ошибка при загрузке заказа:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id, orders]);

  if (isLoading) {
    return <div className={styles.loading}>Загрузка заказа...</div>;
  }

  if (!order) {
    return <div className={styles.loading}>Заказ не найден</div>;
  }

  const orderIngredients = order.ingredients
    .map((ingredientId: string) =>
      items.find((item: TIngredient) => item._id === ingredientId)
    )
    .filter((item): item is TIngredient => item !== undefined);

  const ingredientsCount = orderIngredients.reduce<Record<string, number>>(
    (acc, ingredient) => {
      acc[ingredient._id] = (acc[ingredient._id] ?? 0) + 1;
      return acc;
    },
    {}
  );

  const uniqueIngredients = orderIngredients.filter(
    (ingredient, index, self) =>
      index === self.findIndex((item) => item._id === ingredient._id)
  );

  const totalPrice = orderIngredients.reduce(
    (sum: number, item: TIngredient) => sum + item.price,
    0
  );

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'done':
        return 'Выполнен';
      case 'pending':
        return 'Готовится';
      case 'created':
        return 'Создан';
      default:
        return 'Отменен';
    }
  };

  const statusColor = order.status === 'done' ? '#00CCCC' : '#F2F2F3';

  return (
    <div className={styles.container}>
      <h2 className={`${styles.number} text text_type_digits-default mb-10`}>
        #{order.number}
      </h2>
      <h3 className="text text_type_main-medium mb-3">{order.name}</h3>
      <p className="text text_type_main-default mb-10" style={{ color: statusColor }}>
        {getStatusText(order.status)}
      </p>

      <p className="text text_type_main-medium mb-6">Состав:</p>

      <div className={`${styles.ingredients} mb-10`}>
        {uniqueIngredients.map((ingredient) => (
          <div key={ingredient._id} className={styles.ingredient}>
            <div className={styles.ingredientInfo}>
              <div className={styles.ingredientIcon}>
                <img src={ingredient.image} alt={ingredient.name} />
              </div>
              <span className="text text_type_main-default">{ingredient.name}</span>
            </div>
            <div className={styles.ingredientPrice}>
              <span className="text text_type_digits-default">
                {ingredientsCount[ingredient._id]} x {ingredient.price}
              </span>
              <CurrencyIcon type="primary" />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <span className="text text_type_main-default text_color_inactive">
          {formatDate(order.createdAt)}
        </span>
        <div className={styles.totalPrice}>
          <span className="text text_type_digits-default">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};
