import { Card, Error, Loading } from '@/components/shared';
import { getAxiosError } from '@/lib/common';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';
import { ApiResponse, Task } from 'types';
import { useInfiniteQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import React from 'react';
import { sentences_detailed } from '@prisma/client';
import { uuid } from 'next-s3-upload';
import {
  TrashIcon,
  PlusSmallIcon,
  
  MicrophoneIcon,
} from '@heroicons/react/24/outline';
import RecordVoiceTranscript from './RecordVoiceTranscript';
interface AllTranscriptsProps {
  task: Task;
  fromDataset: boolean;
}
const AllSentences = (props: AllTranscriptsProps) => {
  const { t } = useTranslation('common');
  const { task, fromDataset } = props;

  const [askConfirmation, setAskConfirmation] = useState(false);
  const { inView } = useInView();
  const [visible, setVisible] = useState(false);
  const [confirmTitle, setTitle] = useState(`${t('leave-team')} ${task?.name}`);
  const [confirmText, setConfimText] = useState(`${t('leave-team')}`);
  const [selectedSentence, setSelectedSentence] =
    useState<sentences_detailed>();
  const [desiredAction, setDesiredAction] = useState<
    'update' | 'delete' | 'use' | 'record'
  >('delete');

  const [confirmationMessage, setConfimationMessage] = useState(
    `${t('leave-team-confirmation')}`
  );
  // 21-25 parse the page and perPage  from router.query

  // Lines 27-29: Define limit and skip which is used by DummyJSON API for pagination
  const {
    isLoading,
    isError,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'sentences',
    async ({ pageParam = '' }) => {
      await new Promise((res) => setTimeout(res, 1000));
      if (fromDataset) {
        const res = await axios.get(
          `/api/tasks/${task?.id}/sentences?skip=${4}&limit=${8}&cursor=&lang=${
            task.language
          }` + pageParam
        );
        return res?.data;
      } else {
        const res = await axios.get(
          `/api/tasks/sentences?skip=${4}&limit=${8}&cursor=&lang=${
            task.language
          }` + pageParam
        );
        return res?.data;
      }
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextId ?? false,
    }
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={JSON.stringify(error)} />;
  }
 

  const leaveTeam = async (task: Task) => {
    try {
      await axios.delete<ApiResponse>(
        `/api/tasks/${task.id}/sentences/${selectedSentence?.sentence_id}`
      );
      toast.success(t('task-removed-successfully'));
      // mutateTranscripts();
    } catch (error: any) {
      toast.error(getAxiosError(error));
    }
  };

  const updateSentence = async (task: Task) => {
    try {
      await axios.put<ApiResponse>(
        `/api/tasks/${task.id}/sentences/${selectedSentence?.sentence_id}`
      );
      toast.success(t('task-removed-successfully'));
      // mutateTranscripts();
    } catch (error: any) {
      toast.error(getAxiosError(error));
    }
  };

  const addSentence = async (task: Task) => {
    try {
      await axios.put<ApiResponse>(
        `/api/tasks/${task.id}/sentences/${selectedSentence?.sentence_id}`,
        {
          taskId: task.id,
        }
      );
      toast.success(t('task-removed-successfully'));
      // mutateTranscripts();
    } catch (error: any) {
      toast.error(getAxiosError(error));
    }
  };

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Header>
            <Card.Title>
              {task?.type === 'VOICE TO TEXT'
                ? t('all-transcripts')
                : 'Sentences'}
            </Card.Title>
          </Card.Header>
          <table className="w-full table-fixed text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  {t('id')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('text')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('lang')}
                </th>

                <th scope="col" className="px-6 py-3">
                  {t('username')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.pages.map((task) => {
                  return (
                    <React.Fragment key={task.nextId ?? 'lastPage'}>
                      {task?.data?.sentences?.map(
                        (sentence: sentences_detailed) => (
                          <tr
                            key={uuid()}
                            className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                          >
                            <td className="px-6 py-3">
                              {sentence.sentence_id}
                            </td>

                            <td className="px-6 py-3">{sentence.text}</td>
                            <td className="px-6 py-3">
                              {sentence.lang?.toLocaleUpperCase()}
                            </td>

                            <td className="px-6 py-3">{sentence.username}</td>

                            <td className="px-6 py-3">
                              <div className="join">
                                {!fromDataset && (
                                  <Button
                                    variant="outline"
                                    size="xs"
                                    shape="circle"
                                    color="accent"
                                    onClick={() => {
                                      setTitle('Use Template');
                                      setConfimText('Use Template');
                                      setConfimationMessage(
                                        'Add this sentence template in to your project'
                                      );
                                      setSelectedSentence(sentence);
                                      setDesiredAction('use');
                                      setAskConfirmation(true);
                                    }}
                                  >
                                    <PlusSmallIcon />
                                  </Button>
                                )}

                                <Button
                                  variant="outline"
                                  size="xs"
                                  shape="circle"
                                  color="secondary"
                                  onClick={() => {
                                    setSelectedSentence(sentence);
                                    setDesiredAction('record');
                                    setVisible(!visible);
                                  }}
                                >
                                  <MicrophoneIcon />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="xs"
                                  shape="circle"
                                  color="error"
                                  onClick={() => {
                                    setSelectedSentence(sentence);
                                    setAskConfirmation(true);
                                    setDesiredAction('delete');
                                  }}
                                >
                                  <TrashIcon />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </React.Fragment>
                  );
                })}
              {isFetchingNextPage ? (
                <div className="loading">Loading...</div>
              ) : null}
            </tbody>
          </table>
        </Card.Body>
      </Card>
      <ConfirmationDialog
        visible={askConfirmation}
        title={confirmTitle}
        onCancel={() => setAskConfirmation(false)}
        onConfirm={() => {
          if (desiredAction === 'delete') {
            leaveTeam(task);
          }
          if (desiredAction === 'record') {
            leaveTeam(task);
          }
          if (desiredAction === 'update') {
            updateSentence(task);
          }
          if (desiredAction === 'use') {
            addSentence(task);
          }
        }}
        confirmText={confirmText}
      >
        {confirmationMessage}
      </ConfirmationDialog>

      <RecordVoiceTranscript
        visible={visible}
        setVisible={setVisible}
        task={task}
        audioFileUrl={undefined}
        sentence={selectedSentence}
      />
    </>
  );
};

export default AllSentences;
