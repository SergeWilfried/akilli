import fetcher from '@/lib/fetcher';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import type { ApiResponse, TaskWithFiles } from 'types';

const useTask = (
  id?: string
): { isLoading: boolean; isError: any; task: TaskWithFiles | undefined } => {
  const { query, isReady } = useRouter();

  const taskId = id || (isReady ? query.id : null);

  const { data, error, isLoading } = useSWR<ApiResponse<TaskWithFiles>>(
    taskId ? `/api/tasks/${id}` : null,
    fetcher
  );

  return {
    isLoading,
    isError: error,
    task: data?.data[0],
  };
};

export default useTask;
