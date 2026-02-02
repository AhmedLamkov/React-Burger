import { createAction } from '@reduxjs/toolkit';

import type { TIngredient } from '../../utils/types';

export type IIngredient = {} & TIngredient;

export type IIngredientWithCount = IIngredient & {
  count: number;
};

export type IIngredientsSuccessPayload = IIngredient[];

export const getIngredientsRequest = createAction('ingredients/get/request');
export const getIngredientsSuccess = createAction<IIngredientsSuccessPayload>(
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
