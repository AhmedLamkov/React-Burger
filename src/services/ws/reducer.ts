import { createReducer } from '@reduxjs/toolkit';

import {
  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed,
  wsGetMessage,
  wsConnecting,
} from './actions';

import type { IWsState } from './types';

const initialState: IWsState = {
  wsConnected: false,
  wsConnecting: false,
  orders: [],
  total: null,
  totalToday: null,
  error: null,
};

export const wsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(wsConnecting, (state) => {
      state.wsConnecting = true;
      state.wsConnected = false;
      state.error = null;
    })
    .addCase(wsConnectionSuccess, (state) => {
      state.wsConnecting = false;
      state.wsConnected = true;
      state.error = null;
    })
    .addCase(wsConnectionError, (state, action) => {
      state.wsConnecting = false;
      state.wsConnected = false;
      state.error =
        typeof action.payload === 'string'
          ? action.payload
          : 'WebSocket connection error';
    })
    .addCase(wsConnectionClosed, (state) => {
      state.wsConnecting = false;
      state.wsConnected = false;
      state.error = null;
    })
    .addCase(wsGetMessage, (state, action) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.error = null;
    });
});
