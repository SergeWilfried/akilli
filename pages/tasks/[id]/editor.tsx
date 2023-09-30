import React from 'react';
import Tiptap from '@/components/editor/editor';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-daisyui';
import { TasksTab } from '@/components/tasks';
import { useRouter } from 'next/router';
import { Error, Loading } from '@/components/shared';
import useTask from '../../../hooks/useTask';

export default function TextEditor() {
  const { t } = useTranslation('common');
  const router = useRouter();

  const { id } = router.query as { id: string };
  const { isLoading, isError, task } = useTask(id);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  if (!task) {
    return <Error message={t('team-not-found')} />;
  }
  return (
    <>
      <TasksTab activeTab="editor" task={task} />
      <div className="flex flex-col">
        <div className="flex mt-4 justify-end">
          <Button color="primary" variant="outline" size="md" type="submit">
            {t('create-lang')}{' '}
          </Button>
        </div>
        <Tiptap task={task} />
      </div>
      {/* <div className="flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <h4>{t('all-tasks')}</h4>
          <Button type="submit" color="primary" size="md">
            {t('create-lang')}
          </Button>
        </div>
        <div className="h-8"></div>
        <Tiptap />
      </div> */}
    </>
  );
}
