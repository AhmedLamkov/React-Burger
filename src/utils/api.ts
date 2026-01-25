import type {
  IIngredientsResponse,
  IOrderResponse,
  IBaseApiResponse,
  TIngredient,
  IOrderData,
} from './types';

export const API_URL = 'https://norma.education-services.ru/api';

export const checkResponse = async <T extends IBaseApiResponse>(
  response: Response
): Promise<T> => {
  const data: unknown = await response.json();

  if (!response.ok) {
    const errorData = data as IBaseApiResponse;
    const errorMessage = errorData.message ?? `HTTP error! status: ${response.status}`;
    throw new Error(errorMessage);
  }

  const apiData = data as T;

  if (!apiData.success) {
    const errorMessage = apiData.message ?? 'API request failed';
    throw new Error(errorMessage);
  }

  return apiData;
};

export const fetchWithCheck = async <T extends IBaseApiResponse>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(`${API_URL}${url}`, options);
  return checkResponse<T>(response);
};

export const api = {
  getIngredients: async (): Promise<TIngredient[]> => {
    const data = await fetchWithCheck<IIngredientsResponse>('/ingredients');
    return data.data;
  },

  createOrder: async (ingredients: string[]): Promise<IOrderData> => {
    const data = await fetchWithCheck<IOrderResponse>('/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients }),
    });
    return data.order;
  },
};
