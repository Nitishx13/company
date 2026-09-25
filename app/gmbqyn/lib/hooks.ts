'use client';

import { useCallback, useEffect, useState } from 'react';
import { GmbqynApiError } from '@/lib/gmbqyn';

export interface AsyncState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  reload: () => void;
  setData: (next: T) => void;
}

export function useAsync<T>(loader: () => Promise<T>, deps: unknown[] = []): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    loader()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof GmbqynApiError ? err.message : 'Something went wrong. Please try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  return { data, error, loading, reload, setData };
}

export function useSubmit<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>
) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const run = useCallback(
    async (...args: TArgs): Promise<TResult | null> => {
      setPending(true);
      setError(null);
      setDone(null);
      try {
        const result = await action(...args);
        return result;
      } catch (err: unknown) {
        setError(err instanceof GmbqynApiError ? err.message : 'Something went wrong. Please try again.');
        return null;
      } finally {
        setPending(false);
      }
    },
    [action]
  );

  return { run, pending, error, setError, done, setDone };
}

export const messageOf = (err: unknown) =>
  err instanceof GmbqynApiError ? err.message : 'Something went wrong. Please try again.';
