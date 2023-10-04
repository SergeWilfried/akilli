import { useState } from 'react';
import { Button } from 'react-daisyui';
import { useTranslation } from 'react-i18next';

const TasksInfos = () => {
  // const leaveTeam = async (task: Task) => {
  //   try {
  //     await axios.delete<ApiResponse>(`/api/tasks/${task.id}`);
  //     toast.success(t('leave-team-success'));
  //     mutateTasks();
  //   } catch (error: any) {
  //     toast.error(getAxiosError(error));
  //   }
  // };
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation('common');

  return (
    <>
      {' '}
      <div className="flex items-center justify-between breadcrumbs">
        <ul>
          <li>
            <a>{t('tasks')}</a>
          </li>
          <li>
            <a>Documents</a>
          </li>
          <li>Add Document</li>
        </ul>
        <Button
          color="primary"
          size="md"
          variant="outline"
          onClick={() => {
            setVisible(!visible);
          }}
        >
          {t('create-task')}
        </Button>
      </div>
    </>
  );
};

export default TasksInfos;
