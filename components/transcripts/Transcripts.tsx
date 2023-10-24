import { Card, Error, Loading } from '@/components/shared';
import { getAxiosError } from '@/lib/common';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';
import { ApiResponse, Task } from 'types';

import ConfirmationDialog from '../shared/ConfirmationDialog';
import useSentences from '../../hooks/useSentences';
import { useRouter } from 'next/router';
interface AllTranscriptsProps {
  task: Task;
}
const AllTranscripts = (props: AllTranscriptsProps) => {
  const { t } = useTranslation('common');
  const { task } = props;
  const [askConfirmation, setAskConfirmation] = useState(false);
  const router = useRouter();
  const { transcripts, isLoading, isError, mutateTranscripts } = useSentences(
    task?.id ?? ''
  );
  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  const leaveTeam = async (task: Task) => {
    try {
      await axios.delete<ApiResponse>(`/api/tasks/${task.id}`);
      toast.success(t('task-removed-successfully'));
      mutateTranscripts();
    } catch (error: any) {
      toast.error(getAxiosError(error));
    }
  };

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Header>
            <Card.Title>
              {task?.type === 'VOICE TO TEXT'
                ? t('all-transcripts')
                : 'Sentences'}
            </Card.Title>
          </Card.Header>
          <table className="w-full table-fixed text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  {t('id')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('text')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('lang')}
                </th>

                <th scope="col" className="px-6 py-3">
                  {t('username')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {transcripts &&
                transcripts.map((task) => {
                  return (
                    <tr
                      key={task.sentence_id}
                      className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                    >
                      <td className="px-6 py-3">{task.sentence_id}</td>

                      <td className="px-6 py-3">{task.text}</td>
                      <td className="px-6 py-3">{task.lang?.toLocaleUpperCase()}</td>

                      <td className="px-6 py-3">
                        {task.username}
                      </td>

                      <td className="px-6 py-3">
                        <Button
                          variant="outline"
                          size="xs"
                          color="error"
                          onClick={() => {
                            router.push('/dashboard');
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

export default AllTranscripts;
