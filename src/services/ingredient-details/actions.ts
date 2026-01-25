import { createAction } from '@reduxjs/toolkit';

import type { TIngredient } from '../../utils/types';
export type IIngredientDetails = {} & TIngredient;

export const setIngredientDetails = createAction<IIngredientDetails>(
  'ingredientDetails/set'
);
export const clearIngredientDetails = createAction('ingredientDetails/clear');
