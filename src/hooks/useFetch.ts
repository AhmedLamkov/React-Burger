import { useState, useEffect, useCallback } from 'react';

type TRequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

type UseFetchOptions<T> = {
  method?: TRequestMethod;
  body?: unknown;
  headers?: HeadersInit;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
};

type UseFetchReturn<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

const isApiResponse = <T>(data: unknown): data is ApiResponse<T> => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    typeof (data as { success: unknown }).success === 'boolean'
  );
};

export const useFetch = <T = unknown>(
  url: string,
  options?: UseFetchOptions<T>,
  dependencies: unknown[] = []
): UseFetchReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: options?.method ?? 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: options?.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: unknown = await response.json();

      if (isApiResponse<T>(result)) {
        if (result.success) {
          const resultData = result.data ?? (result as unknown as T);
          setData(resultData);
          options?.onSuccess?.(resultData);
        } else {
          throw new Error(result.message ?? 'Unknown error from API');
        }
      } else {
        setData(result as T);
        options?.onSuccess?.(result as T);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
            ? err
            : 'Unknown error';

      setError(errorMessage);
      options?.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [
    url,
    options?.method,
    JSON.stringify(options?.headers),
    JSON.stringify(options?.body),
  ]);

  useEffect(() => {
    void fetchData();
  }, dependencies);

  const refetch = async (): Promise<void> => {
    await fetchData();
  };

  return { data, loading, error, refetch };
};
