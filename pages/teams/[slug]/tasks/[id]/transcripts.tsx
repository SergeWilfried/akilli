import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { NextPageWithLayout } from 'types';

import { Error, Loading } from '@/components/shared';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import useTask from 'hooks/useTask';
import AllTranscripts from '@/components/transcripts/Transcripts';
import { Button } from 'react-daisyui';
import { TasksTab } from '@/components/tasks';
import { useState } from 'react';
import CreateTranscript from '../../../../../components/transcripts/CreateTranscript';

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
          {isVoiceJob && (
            <>
              {' '}
              <Button
                className="btn"
                variant="outline"
                color="primary"
                size="md"
                onClick={() => {
                  setVisible(!visible);
                }}
              >
                {t('add-new-transcript')}
              </Button>
            </>
          )}
          <div className="dropdown">
            <label tabIndex={0} className="btn m-1">
              Add New
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li
                onClick={() => {
                  setVisible(!visible);
                }}
              >
                <a>Create new sentence</a>
              </li>
              <li
                onClick={() => {
                  setUseDataset(!fromDatasets);
                }}
              >
                <a>Import From Datasets</a>
              </li>
            </ul>
          </div>
        </div>

        <AllTranscripts task={task} fromDataset={fromDatasets}  />
        <CreateTranscript
          visible={visible}
          setVisible={setVisible}
          isVoiceJob={isVoiceJob}
          withDataImport={withDataImport}
          task={task}
          desiredAction={undefined}
          sentence={undefined}
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
