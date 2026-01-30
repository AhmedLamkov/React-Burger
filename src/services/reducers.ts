import { combineReducers } from 'redux';

import authReducer from './auth/slice';
import { constructorReducer } from './burger-constructor/reducer';
import { ingredientDetailsReducer } from './ingredient-details/reducer';
import { ingredientsReducer } from './ingredients/reducer';
import { modalReducer } from './modal/reducer';
import { orderReducer } from './order/reducer';
import passwordResetReducer from './password-reset/slice';
import userReducer from './user/slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  ingredientDetails: ingredientDetailsReducer,
  order: orderReducer,
  modal: modalReducer,
  auth: authReducer,
  user: userReducer,
  passwordReset: passwordResetReducer,
});
