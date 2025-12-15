import { useEffect, useState } from 'react';

import type { IApiResponse } from '@utils/types';

type UseFetchResult<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

const useFetch = <T>(url: string): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: IApiResponse<T> = (await response.json()) as IApiResponse<T>;

        if (!result.success) {
          throw new Error('API вернул неудачный ответ');
        }

        setData(result.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
