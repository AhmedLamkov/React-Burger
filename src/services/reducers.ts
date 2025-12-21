import { combineReducers } from 'redux';

import { constructorReducer } from './burger-constructor/reducer';
import { ingredientDetailsReducer } from './ingredient-details/reducer';
import { ingredientsReducer } from './ingredients/reducer';
import { modalReducer } from './modal/reducer';
import { orderReducer } from './order/reducer';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  ingredientDetails: ingredientDetailsReducer,
  order: orderReducer,
  modal: modalReducer,
});
