import {
  getIngredientsRequest,
  getIngredientsSuccess,
  getIngredientsFailed,
} from './actions';

import type { AppDispatch } from '../store';
import type { IIngredient } from './actions';

const API_URL = 'https://norma.education-services.ru/api';

type IngredientsResponse = {
  success: boolean;
  data: IIngredient[];
};

export const fetchIngredients = (): ((dispatch: AppDispatch) => Promise<void>) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(getIngredientsRequest());

    try {
      const response = await fetch(`${API_URL}/ingredients`);

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }

      const data = (await response.json()) as IngredientsResponse;

      if (data.success) {
        dispatch(getIngredientsSuccess(data.data));
      } else {
        dispatch(getIngredientsFailed());
      }
    } catch (error: unknown) {
      console.error('Ошибка при загрузке ингредиентов:', error);
      dispatch(getIngredientsFailed());
    }
  };
};
