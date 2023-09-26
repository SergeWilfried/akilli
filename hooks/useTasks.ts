import fetcher from '@/lib/fetcher';
import useSWR, { mutate } from 'swr';
import type { ApiResponse, TaskWithFilesCount } from 'types';

const useTasks = () => {
  const url = `/api/tasks`;

  const { data, error, isLoading } = useSWR<ApiResponse<TaskWithFilesCount[]>>(
    url,
    fetcher
  );
  const mutateTasks = async () => {
    mutate(url);
  };

  return {
    isLoading,
    isError: error,
    tasks: data?.data,
    mutateTasks,
  };
};

export default useTasks;
