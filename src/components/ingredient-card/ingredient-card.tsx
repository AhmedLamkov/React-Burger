import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import React, { useRef } from 'react';
import { useDrag, DragPreviewImage } from 'react-dnd';
import { Link, useLocation } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { setIngredientDetails } from '../../services/ingredient-details/actions';
import { openModal } from '../../services/modal/actions';

import type { RootState } from '../../services/store';
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

  const count = useAppSelector((state: RootState) => {
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
    dispatch(
      openModal({
        type: 'ingredientDetails',
        data: ingredient,
      })
    );
  };

  return (
    <>
      <DragPreviewImage connect={preview} src={ingredient.image} />

      <Link
        to={`/ingredients/${ingredient._id}`}
        state={{ background: location }}
        className={styles.link}
      >
        <div
          ref={ref}
          className={`${styles.ingredient_card} ${isDrag ? styles.dragging : ''}`}
          onClick={handleClick}
          data-testid={`ingredient-${ingredient._id}`}
        >
          {count > 0 && (
            <Counter count={count} size="default" extraClass={styles.counter} />
          )}
          <img src={ingredient.image} alt={ingredient.name} className={styles.image} />
          <div className={styles.ingredient_price}>
            <span className="text text_type_digits-default">{ingredient.price}</span>
            <CurrencyIcon type="primary" />
          </div>
          <h3 className={`text text_type_main-default ${styles.ingredient_name}`}>
            {ingredient.name}
          </h3>
        </div>
      </Link>
    </>
  );
};

export default React.memo(IngredientCard);
