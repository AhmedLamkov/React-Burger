import { createAction } from '@reduxjs/toolkit';

import type { IIngredient } from '../ingredients/actions';

export const addIngredient = createAction<IIngredient & { uniqueId: string }>(
  'constructor/addIngredient'
);
export const addBun = createAction<IIngredient>('constructor/addBun');
export const removeIngredient = createAction<string>('constructor/removeIngredient');
export const moveIngredient = createAction<{ dragIndex: number; hoverIndex: number }>(
  'constructor/moveIngredient'
);
export const clearConstructor = createAction('constructor/clear');
