import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import IngredientDetails from '../../components/ingredient-details/ingredient-details';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { setIngredientDetails } from '../../services/ingredient-details/actions';
import { api } from '../../utils/api';

import type { Location } from 'react-router-dom';

import styles from './ingredient-details-page.module.css';

type LocationState = {
  background?: Location;
};

const IngredientDetailsPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const ingredient = useAppSelector((state) => state.ingredientDetails.ingredient);

  useEffect(() => {
    const fetchIngredient = async (): Promise<void> => {
      if (!id) return;

      if (!ingredient || ingredient._id !== id) {
        try {
          const data = await api.getIngredients();
          const foundIngredient = data.find((item) => item._id === id);
          if (foundIngredient) {
            dispatch(setIngredientDetails(foundIngredient));
          }
        } catch (error) {
          console.error('Ошибка загрузки ингредиента:', error);
        }
      }
    };

    void fetchIngredient();
  }, [id, ingredient, dispatch]);

  const locationState = location.state as LocationState | undefined;
  const hasBackground = !!locationState?.background;

  if (hasBackground) {
    return <></>;
  }

  return (
    <div className="mt-30">
      <h1 className={styles.title}>Детали ингредиента</h1>
      <div className="mt-10">
        {ingredient ? (
          <IngredientDetails ingredient={ingredient} />
        ) : (
          <p className="text text_type_main-default text-center">Ингредиент не найден</p>
        )}
      </div>
    </div>
  );
};

export default IngredientDetailsPage;
