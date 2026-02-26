import { fetchWithCheck } from '../../utils/api';
import { clearConstructor } from '../burger-constructor/actions';
import { resetIngredientsCount } from '../ingredients/actions';
import { openModal } from '../modal/actions';
import { createOrderRequest, createOrderSuccess, createOrderFailed } from './actions';

import type { AppDispatch } from '../store';

type TOrderResponse = {
  success: boolean;
  name?: string;
  order: {
    number: number;
    name?: string;
  };
};

export const createOrder = (
  ingredientIds: string[]
): ((dispatch: AppDispatch) => Promise<void>) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(createOrderRequest());

    try {
      const token = localStorage.getItem('accessToken');

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const data = await fetchWithCheck<TOrderResponse>('/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ingredients: ingredientIds,
        }),
      });

      dispatch(
        createOrderSuccess({
          number: data.order.number,
          name: data.order.name ?? data.name ?? 'Ваш заказ',
        })
      );

      dispatch(clearConstructor());
      dispatch(resetIngredientsCount());

      dispatch(
        openModal({
          type: 'orderDetails',
          data: {
            number: data.order.number,
            name: data.order.name ?? data.name ?? 'Ваш заказ',
          },
        })
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      dispatch(createOrderFailed(errorMessage));
    }
  };
};
