import { useParams } from 'react-router-dom';

import { useAppSelector } from '../../services/hooks';

import type { TIngredient } from '../../utils/types';
import type React from 'react';

import styles from './ingredient-details.module.css';

type IngredientDetailsProps = {
  ingredient?: TIngredient;
};

const IngredientDetails: React.FC<IngredientDetailsProps> = ({ ingredient }) => {
  const { id } = useParams();
  const allIngredients = useAppSelector((state) => state.ingredients.items);

  const currentIngredient =
    ingredient ?? allIngredients.find((item: TIngredient) => item._id === id);

  if (!currentIngredient) {
    return (
      <div className={styles.container}>
        <div className="text text_type_main-default mt-10 mb-10">
          Ингредиент не найден
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <img
        src={currentIngredient.image_large}
        alt={currentIngredient.name}
        className={styles.image}
      />
      <h3 className={`${styles.name} text text_type_main-medium mt-4 mb-8`}>
        {currentIngredient.name}
      </h3>
      <div className={`${styles.nutrition} mb-15`}>
        <div className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">
            Калории,ккал
          </span>
          <span className="text text_type_digits-default text_color_inactive">
            {currentIngredient.calories}
          </span>
        </div>
        <div className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">
            Белки, г
          </span>
          <span className="text text_type_digits-default text_color_inactive">
            {currentIngredient.proteins}
          </span>
        </div>
        <div className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">
            Жиры, г
          </span>
          <span className="text text_type_digits-default text_color_inactive">
            {currentIngredient.fat}
          </span>
        </div>
        <div className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">
            Углеводы, г
          </span>
          <span className="text text_type_digits-default text_color_inactive">
            {currentIngredient.carbohydrates}
          </span>
        </div>
      </div>
    </div>
  );
};

export default IngredientDetails;
