import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { NextPageWithLayout } from 'types';
import { TasksTab } from '@/components/tasks';
import { Error, Loading } from '@/components/shared';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import useTask from 'hooks/useTask';
import AllTranscribers from '@/components/tasks/Transcribers';
import { Button } from 'react-daisyui';
import {
  InviteTranscribers,
  PendingAssignments,
} from '@/components/invitation';
import { useState } from 'react';

const Transcribers: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const { id } = router.query as { id: string };
  const { isLoading, isError, task } = useTask(id);
  const [visible, setVisible] = useState(false);

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
      <TasksTab activeTab="transcribers" task={task} />
      <div className="flex flex-col space-y-4">
        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            color="primary"
            size="md"
            onClick={() => {
              setVisible(!visible);
            }}
          >
            {t('add-new-transcriber')}
          </Button>
        </div>
        <AllTranscribers task={task} />
      </div>
      <PendingAssignments task={task} />
      <InviteTranscribers
        visible={visible}
        setVisible={setVisible}
        task={task}
      />
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

export default Transcribers;
