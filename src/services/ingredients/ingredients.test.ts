import { describe, expect, it } from 'vitest';

import {
  getIngredientsRequest,
  getIngredientsSuccess,
  getIngredientsFailed,
  incrementIngredientCount,
  decrementIngredientCount,
  resetIngredientsCount,
} from './actions';
import { ingredientsReducer, type IIngredientsState } from './reducer';

import type { IIngredient } from './actions';

describe('ingredients reducer', () => {
  const mockIngredient: IIngredient = {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    price: 100,
    image: 'test.jpg',
    calories: 100,
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    image_large: 'test-large.jpg',
    image_mobile: 'test-mobile.jpg',
    __v: 0,
  };

  const mockIngredient2: IIngredient = {
    _id: '2',
    name: 'Котлета',
    type: 'main',
    price: 200,
    image: 'test.jpg',
    calories: 200,
    proteins: 20,
    fat: 10,
    carbohydrates: 5,
    image_large: 'test-large.jpg',
    image_mobile: 'test-mobile.jpg',
    __v: 0,
  };

  const mockIngredients: IIngredient[] = [mockIngredient, mockIngredient2];

  const initialState: IIngredientsState = {
    items: [],
    ingredients: [],
    isLoading: false,
    error: false,
  };

  const stateWithIngredients: IIngredientsState = {
    items: mockIngredients,
    ingredients: mockIngredients.map((ing) => ({ ...ing, count: 0 })),
    isLoading: false,
    error: false,
  };

  it('должен возвращать начальное состояние', () => {
    expect(ingredientsReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('getIngredients', () => {
    it('должен обрабатывать getIngredientsRequest', () => {
      const action = getIngredientsRequest();
      const newState = ingredientsReducer(initialState, action);

      expect(newState).toEqual({
        ...initialState,
        isLoading: true,
        error: false,
      });
    });

    it('должен обрабатывать getIngredientsSuccess', () => {
      const action = getIngredientsSuccess(mockIngredients);
      const newState = ingredientsReducer(initialState, action);

      const expectedIngredients = mockIngredients.map((ing) => ({
        ...ing,
        count: 0,
      }));

      expect(newState).toEqual({
        items: mockIngredients,
        ingredients: expectedIngredients,
        isLoading: false,
        error: false,
      });
    });

    it('должен обрабатывать getIngredientsFailed', () => {
      const loadingState = { ...initialState, isLoading: true };
      const action = getIngredientsFailed();
      const newState = ingredientsReducer(loadingState, action);

      expect(newState).toEqual({
        ...initialState,
        isLoading: false,
        error: true,
      });
    });
  });

  describe('incrementIngredientCount', () => {
    it('должен увеличивать count существующего ингредиента', () => {
      const action = incrementIngredientCount('1');
      const newState = ingredientsReducer(stateWithIngredients, action);

      const expectedIngredients = [
        { ...mockIngredient, count: 1 },
        { ...mockIngredient2, count: 0 },
      ];

      expect(newState.ingredients).toEqual(expectedIngredients);
    });

    it('не должен изменять состояние при несуществующем id', () => {
      const action = incrementIngredientCount('999');
      const newState = ingredientsReducer(stateWithIngredients, action);

      expect(newState.ingredients).toEqual(stateWithIngredients.ingredients);
    });

    it('должен увеличивать count несколько раз', () => {
      let state = ingredientsReducer(
        stateWithIngredients,
        incrementIngredientCount('1')
      );
      state = ingredientsReducer(state, incrementIngredientCount('1'));

      expect(state.ingredients[0].count).toBe(2);
    });
  });

  describe('decrementIngredientCount', () => {
    it('должен уменьшать count существующего ингредиента', () => {
      // Сначала увеличим count
      let state = ingredientsReducer(
        stateWithIngredients,
        incrementIngredientCount('1')
      );
      state = ingredientsReducer(state, incrementIngredientCount('1'));

      const action = decrementIngredientCount('1');
      state = ingredientsReducer(state, action);

      expect(state.ingredients[0].count).toBe(1);
    });

    it('не должен уменьшать count ниже 0', () => {
      const action = decrementIngredientCount('1');
      const newState = ingredientsReducer(stateWithIngredients, action);

      expect(newState.ingredients[0].count).toBe(0);
    });

    it('не должен изменять состояние при несуществующем id', () => {
      const action = decrementIngredientCount('999');
      const newState = ingredientsReducer(stateWithIngredients, action);

      expect(newState.ingredients).toEqual(stateWithIngredients.ingredients);
    });

    it('должен корректно работать с count = 0', () => {
      const stateWithCountOne = {
        ...stateWithIngredients,
        ingredients: [
          { ...mockIngredient, count: 1 },
          { ...mockIngredient2, count: 0 },
        ],
      };

      const action = decrementIngredientCount('1');
      const newState = ingredientsReducer(stateWithCountOne, action);

      expect(newState.ingredients[0].count).toBe(0);
    });
  });

  describe('resetIngredientsCount', () => {
    it('должен сбрасывать все count в 0', () => {
      const stateWithCounts = {
        ...stateWithIngredients,
        ingredients: [
          { ...mockIngredient, count: 5 },
          { ...mockIngredient2, count: 3 },
        ],
      };

      const action = resetIngredientsCount();
      const newState = ingredientsReducer(stateWithCounts, action);

      const expectedIngredients = [
        { ...mockIngredient, count: 0 },
        { ...mockIngredient2, count: 0 },
      ];

      expect(newState.ingredients).toEqual(expectedIngredients);
    });

    it('не должен изменять items', () => {
      const stateWithCounts = {
        ...stateWithIngredients,
        ingredients: [
          { ...mockIngredient, count: 5 },
          { ...mockIngredient2, count: 3 },
        ],
      };

      const action = resetIngredientsCount();
      const newState = ingredientsReducer(stateWithCounts, action);

      expect(newState.items).toEqual(stateWithCounts.items);
    });
  });

  describe('комплексные сценарии', () => {
    it('должен корректно обрабатывать последовательность действий', () => {
      let state = ingredientsReducer(initialState, getIngredientsRequest());
      expect(state.isLoading).toBe(true);

      state = ingredientsReducer(state, getIngredientsSuccess(mockIngredients));
      expect(state.isLoading).toBe(false);
      expect(state.items).toHaveLength(2);

      state = ingredientsReducer(state, incrementIngredientCount('1'));
      state = ingredientsReducer(state, incrementIngredientCount('1'));
      expect(state.ingredients[0].count).toBe(2);

      state = ingredientsReducer(state, decrementIngredientCount('1'));
      expect(state.ingredients[0].count).toBe(1);

      state = ingredientsReducer(state, resetIngredientsCount());
      expect(state.ingredients[0].count).toBe(0);
      expect(state.ingredients[1].count).toBe(0);
    });
  });
});
