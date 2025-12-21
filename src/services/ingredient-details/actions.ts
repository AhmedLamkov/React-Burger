import { createAction } from '@reduxjs/toolkit';

export type IIngredientDetails = {
  _id: string;
  name: string;
  type: 'bun' | 'main' | 'sauce';
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
};

export const setIngredientDetails = createAction<IIngredientDetails>(
  'ingredientDetails/set'
);
export const clearIngredientDetails = createAction('ingredientDetails/clear');
