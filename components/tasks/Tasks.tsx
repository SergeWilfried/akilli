import { Card, Error, Loading } from '@/components/shared';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button, Link } from 'react-daisyui';
import { Task } from 'types';

import useTasks from '../../hooks/useTasks';
import { useRouter } from 'next/router';

const Tasks = () => {
  const { t } = useTranslation('common');
  const [currentTask, setTeam] = useState<Task | null>(null);
  const router = useRouter();

  const { tasks, isLoading, isError } = useTasks();
  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  // const leaveTeam = async (task: Task) => {
  //   try {
  //     await axios.delete<ApiResponse>(`/api/tasks/${task.id}`);
  //     toast.success(t('leave-team-success'));
  //     mutateTasks();
  //   } catch (error: any) {
  //     toast.error(getAxiosError(error));
  //   }
  // };

  return (
    <>
      <Card heading={t('all-tasks')}>
        <Card.Body>
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
                        <Link href={`/tasks/${task.id}/settings`}>
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
                              router.push(`tasks/${currentTask.id}`);
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
    </>
  );
};

export default Tasks;
