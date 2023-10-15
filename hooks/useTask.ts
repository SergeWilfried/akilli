import fetcher from '@/lib/fetcher';
import { useRouter } from 'next/router';
import useSWR, { mutate } from 'swr';
import type { ApiResponse } from 'types';

const useTask = (id?: string) => {
  const { query, isReady } = useRouter();

  const taskId = id || (isReady ? query.id : null);
  const url = taskId ? `/api/tasks/${id}` : null;

  const { data, error, isLoading } = useSWR<ApiResponse<any>>(url, fetcher);

  const mutateTasks = async () => {
    mutate(url);
  };

  return {
    isLoading,
    isError: error,
    task: data?.data[0],
    mutateTasks,
  };
};

export default useTask;
