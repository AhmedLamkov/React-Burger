import type { TIngredient } from '../../utils/types';
import type React from 'react';

import styles from './ingredient-card.module.css';

type IngredientCardProps = {
  ingredient: TIngredient;
};

const IngredientCard: React.FC<IngredientCardProps> = ({ ingredient }) => {
  return (
    <div className={styles.ingredient_card}>
      <img src={ingredient.image} alt={ingredient.name} />
      <div className={styles.ingredient_price}>
        <span>{ingredient.price}</span>
        <div className={styles.icon}></div>
      </div>
      <h3 className={styles.ingredient_name}>{ingredient.name}</h3>
    </div>
  );
};

export default IngredientCard;
