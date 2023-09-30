import fetcher from '@/lib/fetcher';
import type { Transcriber, User } from '@prisma/client';
import useSWR, { mutate } from 'swr';
import type { ApiResponse } from 'types';

type TranscriberWithUser = Transcriber & { user: User };

const useTranscribers = (id: string) => {
  const url = `/api/tasks/${id}/transcribers`;

  const { data, error, isLoading } = useSWR<ApiResponse<TranscriberWithUser[]>>(
    url,
    fetcher
  );

  const mutateTranscribers = async () => {
    mutate(url);
  };

  return {
    isLoading,
    isError: error,
    transcribers: data?.data,
    mutateTranscribers,
  };
};

export default useTranscribers;
