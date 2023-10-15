import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { NextPageWithLayout } from 'types';
import { TasksTab } from '../../../components/tasks';
import { Error, Loading } from '@/components/shared';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import useTask from 'hooks/useTask';
import AllTranscripts from '@/components/transcripts/Transcripts';
import { Button } from 'react-daisyui';

const Transcripts: NextPageWithLayout = () => {
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
      <TasksTab activeTab="transcripts" task={task} />
      <div className="flex flex-col space-y-4">
        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            color="primary"
            size="md"
            onClick={() => {}}
          >
            {t('add-new-transcript')}
          </Button>
        </div>
        <AllTranscripts task={task} />
      </div>
    
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

export default Transcripts;
