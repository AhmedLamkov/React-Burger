import { useParams, useLocation } from 'react-router-dom';

import IngredientDetails from '../../components/ingredient-details/ingredient-details';
import { useAppSelector } from '../../services/hooks';

import type { Location } from 'react-router-dom';

import styles from './ingredient-details-page.module.css';

type LocationState = {
  background?: Location;
};

const IngredientDetailsPage = (): React.JSX.Element | null => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const allIngredients = useAppSelector((state) => state.ingredients.items);
  const isLoading = useAppSelector((state) => state.ingredients.isLoading);

  const locationState = location.state as LocationState | undefined;
  const hasBackground = !!locationState?.background;

  if (hasBackground) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="mt-30">
        <p className="text text_type_main-default text-center">Загрузка...</p>
      </div>
    );
  }

  const ingredient = id ? allIngredients.find((item) => item._id === id) : null;

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
