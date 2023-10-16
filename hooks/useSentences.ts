import fetcher from '@/lib/fetcher';
import type { Transcript } from '@prisma/client';
import useSWR, { mutate } from 'swr';
import type { ApiResponse } from 'types';

const useSentences = (id: string) => {
  const url = `/api/tasks/${id}/sentences`;

  const { data, error, isLoading } = useSWR<ApiResponse<Transcript[]>>(
    url,
    fetcher
  );

  const mutateTranscripts = async () => {
    mutate(url);
  };

  return {
    isLoading,
    isError: error,
    transcripts: data?.data,
    mutateTranscripts,
  };
};

export default useSentences;
