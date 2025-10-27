import { useState, useCallback } from 'react';
import { apiService } from '@/services/apiService';
import { toast } from 'sonner';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
}

export function useApi<T = any>(options: UseApiOptions = {}) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const {
    onSuccess,
    onError,
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'Operação realizada com sucesso!',
  } = options;

  const execute = useCallback(
    async (apiCall: () => Promise<T>) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiCall();
        setData(result);

        if (showSuccessToast) {
          toast.success(successMessage);
        }

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erro desconhecido');
        setError(error);

        if (showErrorToast) {
          toast.error(error.message || 'Ocorreu um erro. Tente novamente.');
        }

        if (onError) {
          onError(error);
        }

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, onError, showSuccessToast, showErrorToast, successMessage]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

// Hook específico para chamadas GET com cache
export function useApiGet<T = any>(endpoint: string, options: UseApiOptions = {}) {
  const { execute, ...rest } = useApi<T>(options);

  const fetch = useCallback(() => {
    return execute(() => apiService.get<T>(endpoint));
  }, [endpoint, execute]);

  return {
    ...rest,
    fetch,
  };
}
