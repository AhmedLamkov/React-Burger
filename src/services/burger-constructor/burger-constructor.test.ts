import { describe, expect, it } from 'vitest';

import {
  addIngredient,
  addBun,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} from './actions';
import { constructorReducer, type IConstructorState } from './reducer';

import type { IIngredient } from '../ingredients/actions';

describe('burgerConstructor reducer', () => {
  const mockBun: IIngredient = {
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

  const mockMain: IIngredient = {
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

  const mockSauce: IIngredient = {
    _id: '3',
    name: 'Соус',
    type: 'sauce',
    price: 50,
    image: 'test.jpg',
    calories: 50,
    proteins: 1,
    fat: 2,
    carbohydrates: 10,
    image_large: 'test-large.jpg',
    image_mobile: 'test-mobile.jpg',
    __v: 0,
  };

  const initialState: IConstructorState = {
    bun: null,
    ingredients: [],
  };

  it('должен возвращать начальное состояние', () => {
    expect(constructorReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен обрабатывать addBun', () => {
    const action = addBun(mockBun);
    const newState = constructorReducer(initialState, action);

    expect(newState).toEqual({
      bun: mockBun,
      ingredients: [],
    });
  });

  it('должен обрабатывать addIngredient для не-булки', () => {
    const ingredientWithId = { ...mockMain, uniqueId: 'test-id-123' };
    const action = addIngredient(ingredientWithId);
    const newState = constructorReducer(initialState, action);

    expect(newState).toEqual({
      bun: null,
      ingredients: [ingredientWithId],
    });
  });

  it('должен добавлять ингредиенты в массив при addIngredient (не заменять)', () => {
    const firstIngredient = { ...mockMain, uniqueId: 'test-id-1' };
    const secondIngredient = { ...mockSauce, uniqueId: 'test-id-2' };

    let state = constructorReducer(initialState, addIngredient(firstIngredient));
    state = constructorReducer(state, addIngredient(secondIngredient));

    expect(state.ingredients).toHaveLength(2);
    expect(state.ingredients[0]).toEqual(firstIngredient);
    expect(state.ingredients[1]).toEqual(secondIngredient);
  });

  it('должен обрабатывать removeIngredient', () => {
    const ingredient1 = { ...mockMain, uniqueId: 'id-1' };
    const ingredient2 = { ...mockSauce, uniqueId: 'id-2' };

    const stateWithIngredients = {
      bun: mockBun,
      ingredients: [ingredient1, ingredient2],
    };

    const action = removeIngredient('id-1');
    const newState = constructorReducer(stateWithIngredients, action);

    expect(newState).toEqual({
      bun: mockBun,
      ingredients: [ingredient2],
    });
  });

  it('должен обрабатывать moveIngredient', () => {
    const ingredient1 = { ...mockMain, uniqueId: 'id-1' };
    const ingredient2 = { ...mockSauce, uniqueId: 'id-2' };
    const ingredient3 = { ...mockMain, uniqueId: 'id-3' };

    const stateWithIngredients = {
      bun: mockBun,
      ingredients: [ingredient1, ingredient2, ingredient3],
    };

    const action = moveIngredient({ dragIndex: 2, hoverIndex: 0 });
    const newState = constructorReducer(stateWithIngredients, action);

    expect(newState.ingredients).toEqual([ingredient3, ingredient1, ingredient2]);
  });

  it('должен корректно обрабатывать moveIngredient с одинаковыми индексами', () => {
    const ingredient1 = { ...mockMain, uniqueId: 'id-1' };
    const ingredient2 = { ...mockSauce, uniqueId: 'id-2' };

    const stateWithIngredients = {
      bun: mockBun,
      ingredients: [ingredient1, ingredient2],
    };

    const action = moveIngredient({ dragIndex: 1, hoverIndex: 1 });
    const newState = constructorReducer(stateWithIngredients, action);

    expect(newState.ingredients).toEqual([ingredient1, ingredient2]);
  });

  it('должен обрабатывать clearConstructor', () => {
    const filledState = {
      bun: mockBun,
      ingredients: [
        { ...mockMain, uniqueId: 'id-1' },
        { ...mockSauce, uniqueId: 'id-2' },
      ],
    };

    const action = clearConstructor();
    const newState = constructorReducer(filledState, action);

    expect(newState).toEqual(initialState);
  });

  it('не должен изменять состояние при неизвестном действии', () => {
    const currentState = {
      bun: mockBun,
      ingredients: [{ ...mockMain, uniqueId: 'id-1' }],
    };

    const action = { type: 'UNKNOWN_ACTION' };
    const newState = constructorReducer(currentState, action);

    expect(newState).toEqual(currentState);
  });

  describe('граничные случаи', () => {
    it('должен удалять ингредиент по существующему uniqueId', () => {
      const ingredient = { ...mockMain, uniqueId: 'test-id' };
      const state = {
        bun: null,
        ingredients: [ingredient],
      };

      const newState = constructorReducer(state, removeIngredient('test-id'));
      expect(newState.ingredients).toHaveLength(0);
    });

    it('не должен удалять ингредиент по несуществующему uniqueId', () => {
      const ingredient = { ...mockMain, uniqueId: 'test-id' };
      const state = {
        bun: null,
        ingredients: [ingredient],
      };

      const newState = constructorReducer(state, removeIngredient('wrong-id'));
      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]).toEqual(ingredient);
    });

    it('должен корректно перемещать элемент в конец массива', () => {
      const ingredients = [
        { ...mockMain, uniqueId: 'id-1' },
        { ...mockSauce, uniqueId: 'id-2' },
        { ...mockMain, uniqueId: 'id-3' },
      ];

      const state = {
        bun: mockBun,
        ingredients,
      };

      const newState = constructorReducer(
        state,
        moveIngredient({ dragIndex: 0, hoverIndex: 2 })
      );

      expect(newState.ingredients).toEqual([
        ingredients[1],
        ingredients[2],
        ingredients[0],
      ]);
    });
  });
});
