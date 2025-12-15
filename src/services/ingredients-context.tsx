import { useFetch } from '@/hooks/useFetch';
import { API_URL } from '@/utils/api';
// services/ingredients-context.tsx
import { createContext, useContext, type ReactNode } from 'react';

import type { TIngredient } from '../utils/types';

type IngredientsContextType = {
  ingredients: TIngredient[] | null;
  loading: boolean;
  error: string | null;
};

type IngredientsProviderProps = {
  children: ReactNode;
};

const IngredientsContext = createContext<IngredientsContextType | undefined>(undefined);

export const useIngredients = (): IngredientsContextType => {
  const context = useContext(IngredientsContext);

  if (!context) {
    throw new Error(
      'useIngredients необходимо использовать внутри IngredientsProvider.'
    );
  }

  return context;
};

export const IngredientsProvider: React.FC<IngredientsProviderProps> = ({
  children,
}) => {
  const { data, loading, error } = useFetch<TIngredient[]>(`${API_URL}/ingredients`);

  const value: IngredientsContextType = {
    ingredients: data,
    loading,
    error,
  };

  return (
    <IngredientsContext.Provider value={value}>{children}</IngredientsContext.Provider>
  );
};
