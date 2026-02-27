import { createReducer } from '@reduxjs/toolkit';

import {
  addIngredient,
  addBun,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} from './actions';

import type { IIngredient } from '../ingredients/actions';

export type IConstructorState = {
  bun: IIngredient | null;
  ingredients: (IIngredient & { uniqueId: string })[];
};

export const initialState: IConstructorState = {
  bun: null,
  ingredients: [],
};

export const constructorReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addBun, (state, action) => {
      state.bun = action.payload;
    })
    .addCase(addIngredient, (state, action) => {
      state.ingredients.push(action.payload);
    })
    .addCase(removeIngredient, (state, action) => {
      const uniqueId = action.payload;
      state.ingredients = state.ingredients.filter((item) => item.uniqueId !== uniqueId);
    })
    .addCase(moveIngredient, (state, action) => {
      const { dragIndex, hoverIndex } = action.payload;
      const newIngredients = [...state.ingredients];

      const [draggedItem] = newIngredients.splice(dragIndex, 1);

      newIngredients.splice(hoverIndex, 0, draggedItem);

      state.ingredients = newIngredients;
    })
    .addCase(clearConstructor, (state) => {
      state.bun = null;
      state.ingredients = [];
    });
});
