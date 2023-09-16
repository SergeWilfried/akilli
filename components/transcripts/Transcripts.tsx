import { Card, Error, Loading } from '@/components/shared';
import { getAxiosError } from '@/lib/common';
import axios from 'axios';
import useTeams from 'hooks/useTeams';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';
import { ApiResponse, Task } from 'types';

import ConfirmationDialog from '../shared/ConfirmationDialog';
import useTranscripts from '../../hooks/useTranscripts';

const Transcripts = () => {
  const { t } = useTranslation('common');
  const [task, setTeam] = useState<Task | null>(null);
  const { isLoading, isError, mutateTeams } = useTeams();
  const [askConfirmation, setAskConfirmation] = useState(false);
  const { tasks } = useTranscripts();
  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  const leaveTeam = async (team: Task) => {
    try {
      await axios.put<ApiResponse>(`/api/teams/${team.id}/members`);
      toast.success(t('leave-team-success'));
      mutateTeams();
    } catch (error: any) {
      toast.error(getAxiosError(error));
    }
  };

  return (
    <>
      <Card heading={t('all-transcripts')}>
        <Card.Body>
          <table className="w-full table-fixed text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  {t('id')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('name')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('language')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('type')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('files')}
                </th>

                <th scope="col" className="px-6 py-3">
                  {t('expires-in')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('created-at')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks &&
                tasks.map((task) => {
                  return (
                    <tr
                      key={task.id}
                      className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                    >
                      <td className="px-6 py-3">{task.id}</td>
                      <td className="px-6 py-3">{task.name}</td>
                      <td className="px-6 py-3">{task.language}</td>
                      <td className="px-6 py-3">{task.type}</td>

                      <td className="px-6 py-3">{task._count.files}</td>

                      <td className="px-6 py-3">
                        {new Date(task.deadline).toDateString()}
                      </td>
                      <td className="px-6 py-3">
                        {new Date(task.createdAt).toDateString()}
                      </td>

                      <td className="px-6 py-3">
                        <Button
                          variant="outline"
                          size="xs"
                          color="error"
                          onClick={() => {
                            setTeam(task);
                            setAskConfirmation(true);
                          }}
                        >
                          {t('delete-transcript')}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </Card.Body>
      </Card>
      <ConfirmationDialog
        visible={askConfirmation}
        title={`${t('leave-team')} ${task?.name}`}
        onCancel={() => setAskConfirmation(false)}
        onConfirm={() => {
          if (task) {
            leaveTeam(task);
          }
        }}
        confirmText={t('leave-team')}
      >
        {t('leave-team-confirmation')}
      </ConfirmationDialog>
    </>
  );
};

export default Transcripts;
