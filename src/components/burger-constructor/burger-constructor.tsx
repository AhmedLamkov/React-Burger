import { useAppDispatch, useAppSelector } from '@/services/hooks';
import {
  ConstructorElement,
  Button,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useCallback, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  addIngredient,
  addBun,
  removeIngredient,
  moveIngredient,
} from '../../services/burger-constructor/actions';
import {
  incrementIngredientCount,
  decrementIngredientCount,
} from '../../services/ingredients/actions';
import { openModal } from '../../services/modal/actions';
import { createOrder } from '../../services/order/thunk';
import { WS_CONNECTION_START, WS_DISCONNECT } from '../../services/ws/actions';
import ConstructorItem from '../constructor-item/constructor-item';

import type { TIngredient } from '../../utils/types';
import type React from 'react';

import styles from './burger-constructor.module.css';

const BurgerConstructor: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  const { bun, ingredients } = useAppSelector((state) => state.burgerConstructor);
  const { isLoading, error } = useAppSelector((state) => state.order);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [{ isHover }, drop] = useDrop({
    accept: 'ingredient',
    drop(item: TIngredient) {
      if (item.type === 'bun') {
        dispatch(addBun(item));
        dispatch(decrementIngredientCount(item._id));
      } else {
        const uniqueId = `${item._id}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

        const ingredientWithId = {
          ...item,
          uniqueId,
        };

        dispatch(addIngredient(ingredientWithId));
        dispatch(incrementIngredientCount(item._id));
      }
    },
    collect: (monitor) => ({
      isHover: monitor.isOver(),
    }),
  });

  drop(ref);

  const totalPrice = useMemo(() => {
    const ingredientsPrice = ingredients.reduce((sum, item) => sum + item.price, 0);
    const bunPrice = bun ? bun.price * 2 : 0;
    return ingredientsPrice + bunPrice;
  }, [bun, ingredients]);

  const handleRemoveIngredient = useCallback(
    (uniqueId: string, ingredientId: string): void => {
      dispatch(removeIngredient(uniqueId));
      dispatch(decrementIngredientCount(ingredientId));
    },
    [dispatch]
  );

  const handleCreateOrder = (): void => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (!bun) {
      alert('Пожалуйста, добавьте булку!');
      return;
    }

    if (ingredients.length === 0) {
      alert('Пожалуйста, добавьте начинку!');
      return;
    }

    const ingredientIds = [bun._id, ...ingredients.map((item) => item._id), bun._id];

    const token = localStorage.getItem('accessToken');

    dispatch(createOrder(ingredientIds))
      .then(() => {
        dispatch(openModal({ type: 'orderDetails' }));

        dispatch({ type: WS_DISCONNECT });

        setTimeout(() => {
          dispatch({ type: WS_CONNECTION_START, payload: '/all' });
          if (token) {
            const cleanToken = token.replace('Bearer ', '').trim();
            dispatch({ type: WS_CONNECTION_START, payload: `?token=${cleanToken}` });
          }
        }, 1000);
      })
      .catch(() => {
        alert('Не удалось создать заказ. Попробуйте еще раз.');
      });
  };

  const moveIngredientHandler = useCallback(
    (dragIndex: number, hoverIndex: number): void => {
      dispatch(moveIngredient({ dragIndex, hoverIndex }));
    },
    [dispatch]
  );

  const isOrderButtonDisabled = !bun || ingredients.length === 0 || isLoading;

  return (
    <section
      className={`${styles.constructor} pt-25 pl-4 ${isHover ? styles.hover : ''}`}
      ref={ref}
    >
      <div className={styles.bun}>
        {bun ? (
          <ConstructorElement
            type="top"
            isLocked={true}
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        ) : (
          <div className={`${styles.empty} ${styles.top}`}>
            <p className="text text_type_main-default">Перетащите булку сюда</p>
          </div>
        )}
      </div>

      <div className={styles.scrollable}>
        {ingredients.length > 0 ? (
          ingredients.map((item, index) => (
            <ConstructorItem
              key={item.uniqueId}
              index={index}
              ingredient={item}
              onRemove={() => handleRemoveIngredient(item.uniqueId, item._id)}
              moveIngredient={moveIngredientHandler}
            />
          ))
        ) : (
          <div className={styles.empty}>
            <p className="text text_type_main-default">Перетащите начинку сюда</p>
          </div>
        )}
      </div>

      <div className={styles.bun}>
        {bun ? (
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        ) : (
          <div className={`${styles.empty} ${styles.bottom}`}>
            <p className="text text_type_main-default">Перетащите булку сюда</p>
          </div>
        )}
      </div>

      <div className={`${styles.total} mt-10`}>
        <div className={styles.price}>
          <span className="text text_type_digits-medium">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          type="primary"
          htmlType="button"
          size="large"
          onClick={handleCreateOrder}
          disabled={isOrderButtonDisabled}
        >
          {isLoading ? 'Оформляем...' : 'Оформить заказ'}
        </Button>
      </div>
      {error && <p className={`text text_type_main-default mt-2`}>Ошибка: {error}</p>}
    </section>
  );
};

export default BurgerConstructor;
