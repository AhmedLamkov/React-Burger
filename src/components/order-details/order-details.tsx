import type { FC } from 'react';

import styles from './order-details.module.css';

type OrderDetailsProps = {
  isLoading?: boolean;
};

const OrderDetails: FC<OrderDetailsProps> = ({ isLoading = false }) => {
  const orderNumber = 34536;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <p className="text text_type_main-medium">Заказ оформляется...</p>
      </div>
    );
  }

  return (
    <div className={styles.container} data-testid="order-details">
      <h2 className={`${styles.orderNumber} text text_type_digits-large mt-30`}>
        {orderNumber}
      </h2>

      <p className="text text_type_main-medium mt-8">идентификатор заказа</p>

      <div className={`${styles.checkIcon} mt-15 mb-15`}></div>

      <p className="text text_type_main-default">Ваш заказ начали готовить</p>

      <p className="text text_type_main-default text_color_inactive mt-2 mb-30">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};

export default OrderDetails;
