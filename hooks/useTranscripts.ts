import fetcher from '@/lib/fetcher';
import useSWR, { mutate } from 'swr';
import type { ApiResponse, TaskWithFilesCount } from 'types';

const useTranscripts = () => {
  const url = `/api/tasks`;

  const { data, error, isLoading } = useSWR<ApiResponse<TaskWithFilesCount[]>>(
    url,
    fetcher
  );

  console.log(data);

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

export default useTranscripts;
