import { createReducer } from '@reduxjs/toolkit';

import { setIngredientDetails, clearIngredientDetails } from './actions';

import type { IIngredientDetails } from './actions';

export type IIngredientDetailsState = {
  ingredient: IIngredientDetails | null;
};

const initialState: IIngredientDetailsState = {
  ingredient: null,
};

export const ingredientDetailsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setIngredientDetails, (state, action) => {
      state.ingredient = action.payload;
    })
    .addCase(clearIngredientDetails, (state) => {
      state.ingredient = null;
    });
});
