import { Card, Error, LetterAvatar, Loading } from '@/components/shared';
import { Transcriber } from '@prisma/client';
import axios from 'axios';
import useCanAccess from 'hooks/useCanAccess';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';
import { TaskWithFiles } from '../../types';
import useTranscribers from '../../hooks/useTranscribers';
import { useMemo } from 'react';

const AllTranscribers = ({ task }: { task: TaskWithFiles }) => {
  const { data: session } = useSession();
  const { t } = useTranslation('common');
  const { canAccess } = useCanAccess();

  const { isLoading, isError, transcribers, mutateTranscribers } =
    useTranscribers(task.id);

  const canRemoveMember = useMemo(() => {
    return (member: Transcriber) => {
      return (
        session?.user.id != member.userId &&
        canAccess('team_member', ['delete'])
      );
    };
  }, [session, canAccess]);

  const removeTeamMember = useMemo(() => {
    return async (member: Transcriber) => {
      const sp = new URLSearchParams({ memberId: member.userId });

      await axios.delete(`/api/tasks/${task.id}/members?${sp.toString()}`);

      mutateTranscribers();

      toast.success(t('transcriber-deleted'));
    };
  }, [task.id, mutateTranscribers, t]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  if (!transcribers) {
    return null;
  }

  return (
    <Card heading={t('team-members')}>
      <Card.Body>
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                {t('name')}
              </th>
              <th scope="col" className="px-6 py-3">
                {t('email')}
              </th>
              <th scope="col" className="px-6 py-3">
                {t('country')}
              </th>
              <th scope="col" className="px-6 py-3">
                {t('rating')}
              </th>
              {canAccess('team_member', ['delete']) && (
                <th scope="col" className="px-6 py-3">
                  {t('action')}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {transcribers.map((member) => {
              return (
                <tr
                  key={member.userId}
                  className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-start space-x-2">
                      <LetterAvatar name={member.user.name} />
                      <span>{member.user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">{member.user.email}</td>

                  {canRemoveMember(member) && (
                    <td className="px-6 py-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          removeTeamMember(member);
                        }}
                        size="md"
                      >
                        {t('remove')}
                      </Button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card.Body>
    </Card>
  );
};

export default AllTranscribers;
