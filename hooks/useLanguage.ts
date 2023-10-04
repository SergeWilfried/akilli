import fetcher from '@/lib/fetcher';
import useSWR, { mutate } from 'swr';
import type { ApiResponse, Language } from 'types';

const useLanguage = () => {
  const url = `/api/lang`;

  const { data, error, isLoading } = useSWR<ApiResponse<Language>>(
    url,
    fetcher
  );

  const mutateLanguages = async () => {
    mutate(url);
  };

  return {
    isLoading,
    isError: error,
    languages: data?.data,
    mutateLanguages,
  };
};

export default useLanguage;
