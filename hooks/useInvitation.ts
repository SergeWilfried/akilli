import fetcher from '@/lib/fetcher';
import { Language } from '@prisma/client';
import useSWR from 'swr';
import { ApiResponse } from 'types';

const useInvitation = (name: string) => {
  const url = `/api/lang/${name}`;

  const { data, error, isLoading } = useSWR<ApiResponse<Language>>(
    name ? url : null,
    fetcher
  );

  return {
    isLoading,
    isError: error,
    language: data?.data,
  };
};

export default useInvitation;
