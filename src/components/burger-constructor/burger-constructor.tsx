import {
  ConstructorElement,
  CurrencyIcon,
  Button,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import { ingredients } from '@utils/ingredients';

import type { TIngredient } from '@utils/types';
import type React from 'react';

import styles from './burger-constructor.module.css';

const getIngredientPrice = (name: string): number => {
  const priceMap: Record<string, number> = {
    'Соус традиционный галактический': 30,
    'Мясо бессмертных моллюсков Protostomia': 300,
    'Плоды Фалленианского дерева': 80,
    'Хрустящие минеральные кольца': 80,
  };
  return priceMap[name] ?? 0;
};

const BurgerConstructor: React.FC = () => {
  const selectedBun = ingredients.find(
    (item) => item.name === 'Краторная булка N-200i'
  )!;

  const selectedIngredients: TIngredient[] = [
    ingredients.find((item) => item.name === 'Соус традиционный галактический')!,
    ingredients.find((item) => item.name === 'Мясо бессмертных моллюсков Protostomia')!,
    ingredients.find((item) => item.name === 'Плоды Фалленианского дерева')!,
    ingredients.find((item) => item.name === 'Хрустящие минеральные кольца')!,
    ingredients.find((item) => item.name === 'Хрустящие минеральные кольца')!,
  ];

  const totalPrice = useMemo((): number => {
    const bunPrice = 200;
    const ingredientsPrice = 30 + 300 + 80 + 80 + 80;
    return bunPrice + ingredientsPrice;
  }, []);

  const handleOrderSubmit = (): void => {
    console.log('Заказ оформлен!');
    alert('Заказ оформлен!');
  };

  return (
    <section
      className={`${styles.constructor} pt-25 pl-4`}
      aria-label="Конструктор бургера"
    >
      <div className={`${styles.bunSection} mb-4`}>
        <ConstructorElement
          type="top"
          isLocked={true}
          text={`${selectedBun.name} (верх)`}
          price={20}
          thumbnail={selectedBun.image}
          extraClass={styles.constructorElement}
        />
      </div>

      <ul
        className={`${styles.ingredientsList} custom-scroll pr-2`}
        aria-label="Список начинок"
      >
        {selectedIngredients.map((item, index) => (
          <li key={`${item._id}-${index}`} className={`${styles.constructorItem} mb-4`}>
            <DragIcon type="primary" />
            <ConstructorElement
              text={item.name}
              price={getIngredientPrice(item.name)}
              thumbnail={item.image}
              handleClose={(): void => console.log(`Удалить ${item.name}`)}
              extraClass={styles.constructorElement}
            />
          </li>
        ))}
      </ul>

      <div className={`${styles.bunSection} mt-4`}>
        <ConstructorElement
          type="bottom"
          isLocked={true}
          text={`${selectedBun.name} (низ)`}
          price={200} // 200 как на картинке
          thumbnail={selectedBun.image}
          extraClass={styles.constructorElement}
        />
      </div>

      <div className={`${styles.orderSection} mt-10 pr-4`}>
        <div className={`${styles.totalPrice} text text_type_digits-medium mr-10`}>
          <span className="mr-2">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          htmlType="button"
          type="primary"
          size="large"
          onClick={handleOrderSubmit}
        >
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};

export default BurgerConstructor;
