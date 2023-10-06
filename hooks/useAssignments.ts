import fetcher from '@/lib/fetcher';
import { Invitation } from '@prisma/client';
import useSWR, { mutate } from 'swr';
import { ApiResponse } from 'types';

const useAssignments = (taskId: string) => {
  const url = `/api/tasks/${taskId}/invitations`;

  const { data, error, isLoading } = useSWR<ApiResponse<Invitation[]>>(
    url,
    fetcher
  );

  const mutateInvitation = async () => {
    mutate(url);
  };

  return {
    isLoading,
    isError: error,
    invitations: data?.data,
    mutateInvitation,
  };
};

export default useAssignments;
