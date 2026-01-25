import { createReducer } from '@reduxjs/toolkit';

import {
  createOrderRequest,
  createOrderSuccess,
  createOrderFailed,
  clearOrder,
} from './actions';

export type IOrderState = {
  number: number | null;
  name: string;
  isLoading: boolean;
  error: string | null;
};

const initialState: IOrderState = {
  number: null,
  name: '',
  isLoading: false,
  error: null,
};

export const orderReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(createOrderRequest, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(createOrderSuccess, (state, action) => {
      state.isLoading = false;
      state.number = action.payload.number;
      state.name = action.payload.name;
    })
    .addCase(createOrderFailed, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase(clearOrder, (state) => {
      state.number = null;
      state.name = '';
      state.error = null;
      state.isLoading = false;
    });
});
