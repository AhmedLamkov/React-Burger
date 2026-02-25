import type {
  IIngredientsResponse,
  IOrderResponse,
  IBaseApiResponse,
  TIngredient,
  IOrderData,
  IAuthResponse,
  IUserResponse,
  IForgotPasswordResponse,
  IResetPasswordResponse,
  ILogoutResponse,
  ITokenResponse,
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

const refreshAccessToken = async (): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token');
  }

  const data = await fetchWithCheck<ITokenResponse>('/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: refreshToken }),
  });

  const cleanAccessToken = data.accessToken.replace('Bearer ', '').trim();

  localStorage.setItem('accessToken', cleanAccessToken);
  localStorage.setItem('refreshToken', data.refreshToken.trim());

  return {
    accessToken: cleanAccessToken,
    refreshToken: data.refreshToken.trim(),
  };
};

const retryRequestWithRefresh = async <T extends IBaseApiResponse>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const { accessToken } = await refreshAccessToken();

    const newOptions = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await fetch(`${API_URL}${url}`, newOptions);
    return checkResponse<T>(response);
  } catch {
    throw new Error('Failed to refresh token');
  }
};

export const api = {
  getIngredients: async (): Promise<TIngredient[]> => {
    const data = await fetchWithCheck<IIngredientsResponse>('/ingredients');
    return data.data;
  },

  createOrder: async (ingredients: string[], token?: string): Promise<IOrderData> => {
    const accessToken = token ?? localStorage.getItem('accessToken');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const data = await fetchWithCheck<IOrderResponse>('/orders', {
      method: 'POST',
      headers,
      body: JSON.stringify({ ingredients }),
    });
    return data.order;
  },

  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<IAuthResponse> => {
    return fetchWithCheck<IAuthResponse>('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
  },

  login: async (email: string, password: string): Promise<IAuthResponse> => {
    return fetchWithCheck<IAuthResponse>('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async (refreshToken: string): Promise<ILogoutResponse> => {
    return fetchWithCheck<ILogoutResponse>('/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: refreshToken }),
    });
  },

  refreshToken: async (refreshToken: string): Promise<ITokenResponse> => {
    const response = await fetch(`${API_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: refreshToken }),
    });

    return checkResponse<ITokenResponse>(response);
  },

  getUser: async (): Promise<IUserResponse> => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('No access token');
    }

    try {
      return await fetchWithCheck<IUserResponse>('/auth/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (
        errorMessage.includes('jwt expired') ||
        errorMessage.includes('invalid token')
      ) {
        const newData = await retryRequestWithRefresh<IUserResponse>('/auth/user', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        return newData;
      }
      throw error;
    }
  },

  updateUser: async (userData: {
    name?: string;
    email?: string;
    password?: string;
  }): Promise<IUserResponse> => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('No access token');
    }

    try {
      return await fetchWithCheck<IUserResponse>('/auth/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(userData),
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (
        errorMessage.includes('jwt expired') ||
        errorMessage.includes('invalid token')
      ) {
        const newData = await retryRequestWithRefresh<IUserResponse>('/auth/user', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
        return newData;
      }
      throw error;
    }
  },

  forgotPassword: async (email: string): Promise<IForgotPasswordResponse> => {
    return fetchWithCheck<IForgotPasswordResponse>('/password-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (
    password: string,
    token: string
  ): Promise<IResetPasswordResponse> => {
    return fetchWithCheck<IResetPasswordResponse>('/password-reset/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, token }),
    });
  },
};
