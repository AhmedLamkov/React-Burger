import { createAction } from '@reduxjs/toolkit';

export type IIngredient = {
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
  count?: number;
  uniqueId?: string;
};

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
