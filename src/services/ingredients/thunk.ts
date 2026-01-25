import { fetchWithCheck } from '../../utils/api';
import {
  getIngredientsRequest,
  getIngredientsSuccess,
  getIngredientsFailed,
} from './actions';

import type { AppDispatch } from '../store';
import type { IIngredient } from './actions';

type TIngredientsResponse = {
  success: boolean;
  data: IIngredient[];
};

export const fetchIngredients = (): ((dispatch: AppDispatch) => Promise<void>) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(getIngredientsRequest());

    try {
      const data = await fetchWithCheck<TIngredientsResponse>('/ingredients');
      dispatch(getIngredientsSuccess(data.data));
    } catch (error: unknown) {
      console.error('Ошибка при загрузке ингредиентов:', error);
      dispatch(getIngredientsFailed());
    }
  };
};
