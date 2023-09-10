import fetcher from '@/lib/fetcher';
import type { Transcript } from '@prisma/client';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import type { ApiResponse } from 'types';

const useTranscript = (lang?: string) => {
  const { query, isReady } = useRouter();

  const langCode = lang || (isReady ? query.lang : null);

  const { data, error, isLoading } = useSWR<ApiResponse<Transcript>>(
    langCode ? `/api/lang/${lang}/transcripts` : null,
    fetcher
  );

  return {
    isLoading,
    isError: error,
    team: data?.data,
  };
};

export default useTranscript;
