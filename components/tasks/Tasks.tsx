import { Card, Error, Loading } from '@/components/shared';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button, Link } from 'react-daisyui';
import { ApiResponse, Task } from 'types';
import ConfirmationDialog from '../shared/ConfirmationDialog';

import useTasks from '../../hooks/useTasks';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getAxiosError } from '../../lib/common';

const Tasks = () => {
  const { t } = useTranslation('common');
  const [currentTask, setTeam] = useState<Task | null>(null);
  const [askConfirmation, setAskConfirmation] = useState(false);

  const { tasks, isLoading, isError, mutateTasks } = useTasks();
  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  const deleteTask = async (task: Task) => {
    try {
      await axios.delete<ApiResponse>(`/api/tasks/${task.id}`);
      toast.success(t('leave-team-success'));
      mutateTasks();
    } catch (error: any) {
      toast.error(getAxiosError(error));
    }
  };

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Header>
            <Card.Title>{t('all-tasks')}</Card.Title>
          </Card.Header>
          <table className="w-full table-fixed text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
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
                  {t('status')}
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
                      <td className="px-6 py-3">
                        <Link href={`tasks/${task.id}/settings`}>
                          <div className="flex items-center justify-start space-x-2">
                            <span>{task.name}</span>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-3">{task.language}</td>
                      <td className="px-6 py-3">{task.type}</td>

                      <td className="px-6 py-3">{task.status}</td>

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
                            if (currentTask) {
                              setAskConfirmation(true);
                            }
                          }}
                        >
                          {t('delete')}
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
        title={`${t('delete')} ${currentTask?.name}`}
        onCancel={() => setAskConfirmation(false)}
        onConfirm={() => {
          if (currentTask) {
            deleteTask(currentTask);
          }
        }}
        confirmText={t('delete-task')}
      >
        {t('delete-task-confirmation')}
      </ConfirmationDialog>
    </>
  );
};

export default Tasks;
