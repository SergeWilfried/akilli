import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { NextPageWithLayout } from 'types';
import { TasksTab } from '@/components/tasks';
import { Error, Loading } from '@/components/shared';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import useTask from 'hooks/useTask';
import AllTranscripts from '@/components/transcripts/Transcripts';
import { Button } from 'react-daisyui';
import { useState } from 'react';
import CreateTranscript from '../../../components/transcripts/CreateTranscript';
import ImportFile from '../../../components/files/ImportFile';

const Transcripts: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isUploaderVisible, setImportVisible] = useState(false);

  const { id } = router.query as { id: string };
  const { isLoading, isError, task, mutateTasks } = useTask(id);
  const [visible, setVisible] = useState(false);
  const [withDataImport] = useState(false);

  const isVoiceJob = task?.type === 'VOICE TO TEXT';

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  if (!task) {
    return <Error message={t('team-not-found')} />;
  }
  function handleTranscriptCreated() {
    mutateTasks()
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
            onClick={() => {
              setVisible(!visible);
            }}
          >
            {task?.type === 'VOICE TO TEXT'
              ? t('add-new-transcript')
              : 'Add new Sentence'}
          </Button>
        </div>
        <AllTranscripts task={task} fromDataset={false} />
        <CreateTranscript
          visible={visible}
          setVisible={setVisible}
          isVoiceJob={isVoiceJob}
          withDataImport={withDataImport}
          audioFileUrl={undefined}
          task={task}
          desiredAction={undefined}
          sentence={undefined}
          onConfirm={handleTranscriptCreated}
        />
        <ImportFile
          setVisible={setImportVisible}
          visible={isUploaderVisible}
          task={task}
        />
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
