import { clearConstructor } from '../burger-constructor/actions';
import { resetIngredientsCount } from '../ingredients/actions';
import { createOrderRequest, createOrderSuccess, createOrderFailed } from './actions';

import type { AppDispatch } from '../store';

const API_URL = 'https://norma.education-services.ru/api';

type OrderResponse = {
  success: boolean;
  order: {
    number: number;
    name?: string;
  };
};

// Исправьте типизацию
export const createOrder = (
  ingredientIds: string[]
): ((dispatch: AppDispatch) => Promise<void>) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(createOrderRequest());

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: ingredientIds,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const data = (await response.json()) as OrderResponse;

      if (data.success) {
        dispatch(
          createOrderSuccess({
            number: data.order.number,
            name: data.order.name ?? 'Ваш заказ',
          })
        );
        dispatch(clearConstructor());
        dispatch(resetIngredientsCount());
      } else {
        dispatch(createOrderFailed('API вернул success: false'));
      }
    } catch (error: unknown) {
      console.error('Ошибка при создании заказа:', error);
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      dispatch(createOrderFailed(errorMessage));
    }
  };
};
