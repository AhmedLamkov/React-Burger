import { useIngredients } from '@/services/ingredients-context';
import {
  ConstructorElement,
  CurrencyIcon,
  Button,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import styles from './burger-constructor.module.css';

export type BurgerConstructorProps = {
  onOrderClick: () => void;
  isOrderLoading: boolean;
};

const BurgerConstructor: React.FC<BurgerConstructorProps> = ({
  onOrderClick,
  isOrderLoading,
}) => {
  const { ingredients } = useIngredients();

  // Примерные выбранные ингредиенты
  const selectedBun = useMemo(() => {
    return ingredients?.find((item) => item.type === 'bun') ?? null;
  }, [ingredients]);

  const selectedIngredients = useMemo(() => {
    return ingredients?.filter((item) => item.type !== 'bun').slice(0, 3) ?? [];
  }, [ingredients]);

  const totalPrice = useMemo((): number => {
    const bunPrice = selectedBun ? selectedBun.price * 2 : 0;
    const ingredientsPrice = selectedIngredients.reduce(
      (sum, item) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [selectedBun, selectedIngredients]);

  const handleOrderSubmit = (): void => {
    onOrderClick();
  };

  if (!ingredients) {
    return (
      <section className={`${styles.constructor} pt-25 pl-4`}>
        <p className="text text_type_main-default">Загрузка...</p>
      </section>
    );
  }

  return (
    <section
      className={`${styles.constructor} pt-25 pl-4`}
      aria-label="Конструктор бургера"
    >
      {selectedBun ? (
        <div className={`${styles.bunSection} mb-4`}>
          <ConstructorElement
            type="top"
            isLocked={true}
            text={`${selectedBun.name} (верх)`}
            price={selectedBun.price}
            thumbnail={selectedBun.image}
            extraClass={styles.constructorElement}
          />
        </div>
      ) : (
        <div className={`${styles.emptyBun} mb-4`}>
          <p className="text text_type_main-default text_color_inactive">
            Выберите булку
          </p>
        </div>
      )}

      <ul className={`${styles.ingredientsList} custom-scroll pr-2`}>
        {selectedIngredients.length > 0 ? (
          selectedIngredients.map((item, index) => (
            <li
              key={`${item._id}-${index}`}
              className={`${styles.constructorItem} mb-4`}
            >
              <DragIcon type="primary" />
              <ConstructorElement
                text={item.name}
                price={item.price}
                thumbnail={item.image}
                handleClose={(): void => console.log(`Удалить ${item.name}`)}
                extraClass={styles.constructorElement}
              />
            </li>
          ))
        ) : (
          <li
            className={`${styles.emptyIngredient} text text_type_main-default text_color_inactive`}
          >
            Выберите начинку
          </li>
        )}
      </ul>

      {selectedBun ? (
        <div className={`${styles.bunSection} mt-4`}>
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text={`${selectedBun.name} (низ)`}
            price={selectedBun.price}
            thumbnail={selectedBun.image}
            extraClass={styles.constructorElement}
          />
        </div>
      ) : (
        <div className={`${styles.emptyBun} mt-4`}>
          <p className="text text_type_main-default text_color_inactive">
            Выберите булку
          </p>
        </div>
      )}

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
          disabled={isOrderLoading || !selectedBun || totalPrice === 0}
        >
          {isOrderLoading ? 'Оформляем...' : 'Оформить заказ'}
        </Button>
      </div>
    </section>
  );
};

export default BurgerConstructor;
