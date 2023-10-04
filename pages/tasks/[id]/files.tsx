import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { NextPageWithLayout } from 'types';
import { AccessControl } from '../../../components/shared/AccessControl';
import { TasksTab, RemoveTask } from '../../../components/tasks';
import { Error, Loading } from '@/components/shared';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import useTask from '../../../hooks/useTask';
import { Button } from 'react-daisyui';

const Files: NextPageWithLayout = () => {
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
      <TasksTab activeTab="files" task={task} />

      <div className="flex flex-col space-y-4">
        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            color="primary"
            size="md"
            onClick={() => {}}
          >
            {t('new-file-import')}
          </Button>
        </div>
        <div className="p-3">
          <p className="text-sm">
            This is just a placeholder for the dashboard.
          </p>
        </div>
      </div>
      <AccessControl resource="team" actions={['delete']}>
        <RemoveTask task={task} />
      </AccessControl>
    </>
  );
};

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
}

export default Files;
