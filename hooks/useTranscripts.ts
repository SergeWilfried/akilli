import fetcher from '@/lib/fetcher';
import useSWR, { mutate } from 'swr';
import type { ApiResponse, Transcript } from 'types';

const useTranscripts = () => {
  const url = `/api/transcripts`;

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
    languages: data?.data,
    mutateTranscripts,
  };
};

export default useTranscripts;
