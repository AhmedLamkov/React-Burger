import { createReducer } from '@reduxjs/toolkit';

import {
  getIngredientsRequest,
  getIngredientsSuccess,
  getIngredientsFailed,
  incrementIngredientCount,
  decrementIngredientCount,
  resetIngredientsCount,
} from './actions';

import type { IIngredientWithCount } from './actions';
import type { TIngredient } from '@/utils/types';

export type IIngredientsState = {
  items: TIngredient[];
  ingredients: IIngredientWithCount[];
  isLoading: boolean;
  error: boolean;
};

export const initialState: IIngredientsState = {
  items: [],
  ingredients: [],
  isLoading: false,
  error: false,
};

export const ingredientsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(getIngredientsRequest, (state) => {
      state.isLoading = true;
      state.error = false;
    })
    .addCase(getIngredientsSuccess, (state, action) => {
      state.isLoading = false;
      state.items = action.payload;
      state.ingredients = action.payload.map((ingredient) => ({
        ...ingredient,
        count: 0,
      })) as IIngredientWithCount[];
    })
    .addCase(getIngredientsFailed, (state) => {
      state.isLoading = false;
      state.error = true;
    })
    .addCase(incrementIngredientCount, (state, action) => {
      const id = action.payload;
      const ingredient = state.ingredients.find((item) => item._id === id);
      if (ingredient) {
        ingredient.count += 1;
      }
    })
    .addCase(decrementIngredientCount, (state, action) => {
      const id = action.payload;
      const ingredient = state.ingredients.find((item) => item._id === id);
      if (ingredient && ingredient.count > 0) {
        ingredient.count -= 1;
      }
    })
    .addCase(resetIngredientsCount, (state) => {
      state.ingredients.forEach((ingredient) => {
        ingredient.count = 0;
      });
    });
});
