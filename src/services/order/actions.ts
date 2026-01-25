import { createAction } from '@reduxjs/toolkit';

export type IOrder = {
  number: number;
  name: string;
};

export const createOrderRequest = createAction('order/create/request');
export const createOrderSuccess = createAction<IOrder>('order/create/success');
export const createOrderFailed = createAction<string>('order/create/failed');
export const clearOrder = createAction('order/clear');
