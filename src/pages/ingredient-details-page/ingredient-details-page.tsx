import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import IngredientDetails from '../../components/ingredient-details/ingredient-details';
import { useAppSelector } from '../../services/hooks';

import type { TIngredient } from '../../utils/types';

import styles from './ingredient-details-page.module.css';

const IngredientDetailsPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const ingredients = useAppSelector(
    (state) =>
      state.ingredients.ingredients.map(
        ({ count: _count, ...ingredient }) => ingredient
      ) as TIngredient[]
  );

  const ingredient = ingredients.find((item: TIngredient) => item._id === id);

  useEffect(() => {
    if (!ingredient) {
      navigate('/', { replace: true });
    }
  }, [ingredient, navigate]);

  if (!ingredient) {
    return <></>;
  }

  return (
    <div className={styles.container}>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5`}>
        Детали ингредиента
      </h1>
      <IngredientDetails ingredient={ingredient} />
    </div>
  );
};

export default IngredientDetailsPage;
