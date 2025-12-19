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
  execute: (endpoint: string, options?: RequestInit) => Promise<T | null>;
}

export function useApi<T = any>(options?: UseApiOptions): UseApiReturn<T> {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const execute = async (endpoint: string, fetchOptions?: RequestInit): Promise<T | null> => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`/api/${endpoint}`, {
        ...fetchOptions,
        headers: {
          "Content-Type": "application/json",
          ...fetchOptions?.headers,
        },
      });

      const result: ApiResponse<T> | ApiErrorResponse = await response.json();

      if (!result.success) {
        const errorMessage = (result as ApiErrorResponse).error || "An error occurred";
        setError(errorMessage);
        options?.onError?.(errorMessage);
        return null;
      }

      const responseData = (result as ApiResponse<T>).data;
      setData(responseData);
      options?.onSuccess?.(responseData);
      return responseData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Network error";
      setError(errorMessage);
      options?.onError?.(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, data, error, execute };
}
