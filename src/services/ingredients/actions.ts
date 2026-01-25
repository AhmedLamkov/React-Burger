import { createAction } from '@reduxjs/toolkit';

import type { TIngredient } from '../../utils/types';

export type IIngredient = {} & TIngredient;
export type IIngredientWithCount = {
  count: number;
} & IIngredient;

export const getIngredientsRequest = createAction('ingredients/get/request');
export const getIngredientsSuccess = createAction<IIngredient[]>(
  'ingredients/get/success'
);
export const getIngredientsFailed = createAction('ingredients/get/failed');

export const incrementIngredientCount = createAction<string>(
  'ingredients/count/increment'
);
export const decrementIngredientCount = createAction<string>(
  'ingredients/count/decrement'
);
export const resetIngredientsCount = createAction('ingredients/count/reset');
