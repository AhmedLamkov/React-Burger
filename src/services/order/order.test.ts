import { describe, expect, it } from 'vitest';

import {
  createOrderRequest,
  createOrderSuccess,
  createOrderFailed,
  clearOrder,
} from './actions';
import { orderReducer, type IOrderState } from './reducer';

import type { IOrder } from './actions';

describe('order reducer', () => {
  const mockOrder: IOrder = {
    number: 12345,
    name: 'Космический бургер',
  };

  const initialState: IOrderState = {
    number: null,
    name: '',
    isLoading: false,
    error: null,
  };

  it('должен возвращать начальное состояние', () => {
    expect(orderReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('createOrder', () => {
    it('должен обрабатывать createOrderRequest', () => {
      const action = createOrderRequest();
      const newState = orderReducer(initialState, action);

      expect(newState).toEqual({
        number: null,
        name: '',
        isLoading: true,
        error: null,
      });
    });

    it('должен обрабатывать createOrderSuccess', () => {
      const action = createOrderSuccess(mockOrder);
      const newState = orderReducer(initialState, action);

      expect(newState).toEqual({
        number: 12345,
        name: 'Космический бургер',
        isLoading: false,
        error: null,
      });
    });

    it('должен обрабатывать createOrderFailed', () => {
      const errorMessage = 'Ошибка создания заказа';
      const action = createOrderFailed(errorMessage);
      const loadingState = { ...initialState, isLoading: true };
      const newState = orderReducer(loadingState, action);

      expect(newState).toEqual({
        number: null,
        name: '',
        isLoading: false,
        error: errorMessage,
      });
    });
  });

  describe('clearOrder', () => {
    it('должен очищать состояние заказа', () => {
      const stateWithOrder: IOrderState = {
        number: 12345,
        name: 'Космический бургер',
        isLoading: false,
        error: null,
      };

      const action = clearOrder();
      const newState = orderReducer(stateWithOrder, action);

      expect(newState).toEqual(initialState);
    });

    it('должен очищать состояние даже если был error', () => {
      const stateWithError: IOrderState = {
        number: null,
        name: '',
        isLoading: false,
        error: 'Ошибка',
      };

      const action = clearOrder();
      const newState = orderReducer(stateWithError, action);

      expect(newState).toEqual(initialState);
    });

    it('должен очищать состояние если была загрузка', () => {
      const loadingState: IOrderState = {
        number: null,
        name: '',
        isLoading: true,
        error: null,
      };

      const action = clearOrder();
      const newState = orderReducer(loadingState, action);

      expect(newState).toEqual(initialState);
    });
  });

  describe('граничные случаи', () => {
    it('должен обрабатывать createOrderSuccess с минимальными данными', () => {
      const minimalOrder: IOrder = {
        number: 1,
        name: 'Заказ',
      };

      const action = createOrderSuccess(minimalOrder);
      const newState = orderReducer(initialState, action);

      expect(newState).toEqual({
        number: 1,
        name: 'Заказ',
        isLoading: false,
        error: null,
      });
    });

    it('должен сбрасывать error при новом запросе', () => {
      const stateWithError: IOrderState = {
        number: 12345,
        name: 'Космический бургер',
        isLoading: false,
        error: 'Старая ошибка',
      };

      const action = createOrderRequest();
      const newState = orderReducer(stateWithError, action);

      // При новом запросе данные сохраняются, только isLoading и error меняются
      expect(newState).toEqual({
        number: 12345,
        name: 'Космический бургер',
        isLoading: true,
        error: null,
      });
    });

    it('должен сохранять данные заказа при ошибке', () => {
      const stateWithOrder: IOrderState = {
        number: 12345,
        name: 'Космический бургер',
        isLoading: true,
        error: null,
      };

      const errorMessage = 'Новая ошибка';
      const action = createOrderFailed(errorMessage);
      const newState = orderReducer(stateWithOrder, action);

      // При ошибке данные сохраняются, только isLoading и error меняются
      expect(newState).toEqual({
        number: 12345,
        name: 'Космический бургер',
        isLoading: false,
        error: errorMessage,
      });
    });

    it('должен обрабатывать несколько действий подряд', () => {
      let state = orderReducer(initialState, createOrderRequest());
      expect(state).toEqual({
        number: null,
        name: '',
        isLoading: true,
        error: null,
      });

      state = orderReducer(state, createOrderSuccess(mockOrder));
      expect(state).toEqual({
        number: 12345,
        name: 'Космический бургер',
        isLoading: false,
        error: null,
      });

      // Новый запрос - данные сохраняются
      state = orderReducer(state, createOrderRequest());
      expect(state).toEqual({
        number: 12345,
        name: 'Космический бургер',
        isLoading: true,
        error: null,
      });

      // Ошибка - данные сохраняются
      const errorMessage = 'Ошибка';
      state = orderReducer(state, createOrderFailed(errorMessage));
      expect(state).toEqual({
        number: 12345,
        name: 'Космический бургер',
        isLoading: false,
        error: errorMessage,
      });

      // Очистка - все сбрасывается
      state = orderReducer(state, clearOrder());
      expect(state).toEqual(initialState);
    });
  });
});
