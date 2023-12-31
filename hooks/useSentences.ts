import fetcher from '@/lib/fetcher';
import { sentences_detailed } from '@prisma/client';
import useSWR, { mutate } from 'swr';
import type { ApiResponse } from 'types';

const useSentences = (
  id: string,
  skip: string,
  limit: string,
  lang: string
) => {
  const url = `/api/tasks/${id}/sentences?skip=${skip}&limit=${limit}&lang=${lang}`;

  const { data, error, isLoading } = useSWR<
    ApiResponse<{ pagination: any; sentences: sentences_detailed[] }>
  >(url, fetcher);
  const mutateTranscripts = async () => {
    mutate(url);
  };

  return {
    isLoading,
    isError: error,
    transcripts: data?.data.sentences,
    count: data?.data.sentences.length,
    mutateTranscripts,
  };
};

export default useSentences;
