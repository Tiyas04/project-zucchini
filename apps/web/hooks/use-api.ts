import { useState } from "react";

interface ApiResponse<T = any> {
  success: true;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

interface UseApiReturn<T> {
  loading: boolean;
  data: T | null;
  error: string | null;
  execute: (endpoint: string, options?: RequestInit) => Promise<void>;
}

export function useApi<T = any>(options?: UseApiOptions): UseApiReturn<T> {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const execute = async (endpoint: string, fetchOptions?: RequestInit) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(endpoint, {
        ...fetchOptions,
        headers: {
          "Content-Type": "application/json",
          ...fetchOptions?.headers,
        },
      });

      const result: ApiResponse<T> | ApiErrorResponse = await response.json();

      // Handle error responses
      if (!result.success) {
        const errorMessage = result.error || "An error occurred";
        setError(errorMessage);
        options?.onError?.(errorMessage);
        return;
      }

      // Handle success responses
      setData(result.data);
      options?.onSuccess?.(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Network error";
      setError(errorMessage);
      options?.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { loading, data, error, execute };
}
