import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import React, { useRef } from 'react';
import { useDrag, DragPreviewImage } from 'react-dnd';
import { Link, useLocation } from 'react-router-dom';

import { addIngredient, addBun } from '../../services/burger-constructor/actions';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { setIngredientDetails } from '../../services/ingredient-details/actions';
import { incrementIngredientCount } from '../../services/ingredients/actions';

import type { TIngredient } from '@/utils/types';

import styles from './ingredient-card.module.css';

type IngredientCardProps = {
  ingredient: TIngredient;
  onClick?: () => void;
};

const IngredientCard: React.FC<IngredientCardProps> = ({ ingredient }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  const count = useAppSelector((state) => {
    const foundIngredient = state.ingredients.ingredients.find(
      (item) => item._id === ingredient._id
    );
    return foundIngredient?.count ?? 0;
  });

  const [{ isDrag }, dragRef, preview] = useDrag({
    type: 'ingredient',
    item: () => ({ ...ingredient, type: ingredient.type }),
    collect: (monitor) => ({
      isDrag: monitor.isDragging(),
    }),
  });

  dragRef(ref);

  const handleClick = (): void => {
    dispatch(setIngredientDetails(ingredient));
  };

  const handleAddToConstructor = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    if (ingredient.type === 'bun') {
      dispatch(addBun(ingredient));
    } else {
      const uniqueId = `${ingredient._id}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      dispatch(addIngredient({ ...ingredient, uniqueId }));
    }
    dispatch(incrementIngredientCount(ingredient._id));
  };

  return (
    <>
      <DragPreviewImage connect={preview} src={ingredient.image} />

      <Link
        to={`/ingredients/${ingredient._id}`}
        state={{ background: location }}
        className={styles.link}
        data-testid={`ingredient-link-${ingredient._id}`}
        onClick={handleClick}
      >
        <div
          ref={ref}
          className={`${styles.ingredient_card} ${isDrag ? styles.dragging : ''}`}
          data-testid={`ingredient-item-${ingredient._id}`}
        >
          {count > 0 && (
            <Counter count={count} size="default" extraClass={styles.counter} />
          )}
          <img
            src={ingredient.image}
            alt={ingredient.name}
            className={styles.image}
            data-testid={`ingredient-image-${ingredient._id}`}
          />
          <div className={styles.ingredient_price}>
            <span className="text text_type_digits-default">{ingredient.price}</span>
            <CurrencyIcon type="primary" />
          </div>
          <h3 className={`text text_type_main-default ${styles.ingredient_name}`}>
            {ingredient.name}
          </h3>
        </div>
      </Link>

      <button
        style={{ display: 'none' }}
        data-testid={`add-ingredient-${ingredient._id}`}
        onClick={handleAddToConstructor}
      >
        Add to constructor
      </button>
    </>
  );
};

export default React.memo(IngredientCard);
