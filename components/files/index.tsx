import { Card, EmptyState, WithLoadingAndError } from '@/components/shared';
import Badge from '@/components/shared/Badge';
import ConfirmationDialog from '@/components/shared/ConfirmationDialog';
import { Error, Loading } from '@/components/shared';
import type { Task } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button } from 'react-daisyui';

import useTask from 'hooks/useTask';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getAxiosError } from '../../lib/common';
import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import CreateTranscript from '../transcripts/CreateTranscript';

interface FilesProps {
  currentTask: Task;
}

const AllFiles = ({ currentTask }: FilesProps) => {
  const { t } = useTranslation('common');

  const { isLoading, isError, task, mutateTasks } = useTask(
    currentTask.id ?? ''
  );
  const [visible, setVisible] = useState(false);
  const [askConfirmation, setAskConfirmation] = useState(false);
  const [confirmationMessage] = useState(`${t('leave-team-confirmation')}`);
  const [selectedFile, setSelectedFile] = useState<any | null>(null);
  const [confirmTitle, setTitle] = useState(`${t('leave-team')} ${task?.name}`);
  const [confirmText, setConfimText] = useState(`${t('leave-team')}`);

  const [desiredAction, setDesiredAction] = useState<
    'update' | 'delete' | 'use'
  >('delete');
  // Fetch API Keys

  // Delete File
  const deleteFile = async () => {
    try {
      await axios.delete(`/api/tasks/${task?.id}/files/${selectedFile?.id}`);
      toast.success(t('file-deleted'));
      mutateTasks();
    } catch (error: any) {
      toast.error(getAxiosError(error));
    }
  };

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
    <WithLoadingAndError isLoading={isLoading} error={!task}>
      {task.files.length === 0 ? (
        <EmptyState
          title={t('no-file-title')}
          description={t('no-file-description')}
        />
      ) : (
        <>
          <Card>
            <Card.Body>
              <Card.Header>
                <Card.Title>{t('files')}</Card.Title>
              </Card.Header>
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      <input type="checkbox" />
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {t('url')}
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {t('size')}
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {t('format')}
                    </th>

                    <th scope="col" className="px-6 py-3">
                      {t('created')}
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {t('actions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {task.files.map((file) => {
                    return (
                      <tr key={file.url} className="border-b bg-white">
                        <td className="px-6 py-3">
                          <input type="checkbox" />
                        </td>
                        <td className="px-6 py-3">{file.url}</td>
                        <td className="px-6 py-3">
                          {Math.ceil(file.contentSize / 10e6) + `MB`}
                        </td>

                        <td className="px-6 py-3">
                          <Badge
                            color={
                              file.fileFormat === 'audio/wav'
                                ? 'success'
                                : 'secondary'
                            }
                          >
                            {file.fileFormat}
                          </Badge>
                        </td>
                        <td className="px-6 py-3">
                          {new Date(file?.createdAt).toDateString()}
                        </td>
                        <td className="px-6 py-3">
                          <div className="join">
                            <Button
                              variant="outline"
                              size="xs"
                              shape="circle"
                              color="primary"
                              onClick={() => {
                                setSelectedFile(file);
                                setDesiredAction('update');
                                setVisible(!visible);
                              }}
                            >
                              <PencilIcon />
                            </Button>

                            <Button
                              variant="outline"
                              size="xs"
                              shape="circle"
                              color="error"
                              onClick={() => {
                                setSelectedFile(file);
                                setAskConfirmation(true);
                                setDesiredAction('delete');
                              }}
                            >
                              <TrashIcon />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
                deleteFile();
              }
              if (desiredAction === 'update') {
              }
              if (desiredAction === 'use') {
              }
            }}
            confirmText={confirmText}
          >
            {confirmationMessage}
          </ConfirmationDialog>
          <CreateTranscript
            visible={visible}
            setVisible={setVisible}
            isVoiceJob={true}
            withDataImport={false}
            task={task}
            audioFileUrl={selectedFile?.url}
            sentence={undefined}
            desiredAction={undefined}
          />
        </>
      )}
    </WithLoadingAndError>
  );
};

export default AllFiles;
