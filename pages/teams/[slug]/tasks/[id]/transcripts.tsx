import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { NextPageWithLayout } from 'types';

import { Error, Loading } from '@/components/shared';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import useTask from 'hooks/useTask';
import AllTranscripts from '@/components/transcripts/Transcripts';
import { TasksTab } from '@/components/tasks';
import { useState } from 'react';
import CreateTranscript from '../../../../../components/transcripts/CreateTranscript';
import AllSentences from '../../../../../components/transcripts/Sentences';
import { Button } from 'react-daisyui';
import RecordVoiceTranscript from '../../../../../components/transcripts/RecordVoiceTranscript';

const Transcripts: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const { id } = router.query as { id: string };
  const { isLoading, isError, task } = useTask(id);
  const [visible, setVisible] = useState(false);
  const [fromDatasets, setUseDataset] = useState(true);

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
  return (
    <>
      <TasksTab activeTab="transcripts" task={task} />
      <div className="flex flex-col space-y-4">
        <div className="flex justify-end mt-4">
          <div>
            <Button
              onClick={() => {
                setVisible(!visible);
              }}
              color="primary"
              loading={false}
              active={true}
              fullWidth
              size="md"
            >
              Add New
            </Button>
          </div>
          <div>
            <Button
              onClick={() => {
                setUseDataset(!fromDatasets);
              }}
              color="secondary"
              loading={false}
              active={true}
              fullWidth
              size="md"
            >
              Import
            </Button>
          </div>
        </div>
        {isVoiceJob && (
          <AllTranscripts task={task} fromDataset={fromDatasets} />
        )}
        {!isVoiceJob && <AllSentences task={task} fromDataset={fromDatasets} />}
        {!isVoiceJob && (
          <CreateTranscript
            visible={visible}
            setVisible={setVisible}
            isVoiceJob={isVoiceJob}
            withDataImport={withDataImport}
            audioFileUrl={undefined}
            task={task}
            desiredAction={undefined}
            sentence={undefined}
          />
        )}
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
