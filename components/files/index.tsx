import { Card, EmptyState, WithLoadingAndError } from '@/components/shared';
import Badge from '@/components/shared/Badge';
import ConfirmationDialog from '@/components/shared/ConfirmationDialog';
import { Error, Loading } from '@/components/shared';
import type { Task } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button } from 'react-daisyui';

import useTask from '../../hooks/useTask';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getAxiosError } from '../../lib/common';
import React from 'react';

interface FilesProps {
  currentTask: Task;
}

const AllFiles = ({ currentTask }: FilesProps) => {
  const { t } = useTranslation('common');
  const [confirmationDialogVisible, setConfirmationDialogVisible] =
    useState(false);
  const { isLoading, isError, task, mutateTasks } = useTask(
    currentTask.id ?? ''
  );
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Fetch API Keys
  console.log('tasks files', task?.files);

  // Delete File
  const deleteFile = async () => {
    try {
      await axios.delete(`/api/tasks/${task?.id}/files/${selectedFile}`);
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
          <Card heading={t('files')}>
            <Card.Body>
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
                  {task.files.map((apiKey) => {
                    return (
                      <tr key={apiKey.url} className="border-b bg-white">
                        <td className="px-6 py-3">
                          <input type="checkbox" />
                        </td>
                        <td className="px-6 py-3">{apiKey.url}</td>
                        <td className="px-6 py-3">{apiKey.contentSize}</td>

                        <td className="px-6 py-3">
                          <Badge
                            color={
                              apiKey.fileFormat === 'audio/wav'
                                ? 'success'
                                : 'secondary'
                            }
                          >
                            {apiKey.fileFormat}
                          </Badge>
                        </td>
                        <td className="px-6 py-3">
                          <audio controls>
                            <source
                              src={`http://localhost:9000/${apiKey.url}`}
                              type={apiKey.fileFormat}
                            />
                          </audio>
                        </td>
                        <td className="px-6 py-3">
                          <Button
                            size="xs"
                            color="error"
                            variant="outline"
                            onClick={() => {
                              setConfirmationDialogVisible(true);
                              setSelectedFile(apiKey.id);
                            }}
                          >
                            {t('delete')}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card.Body>
          </Card>
          <ConfirmationDialog
            title={t('delete-file')}
            visible={confirmationDialogVisible}
            onConfirm={() => {
              if (selectedFile) {
                deleteFile();
              }
            }}
            onCancel={() => setConfirmationDialogVisible(false)}
            cancelText={t('cancel')}
            confirmText={t('delete-file')}
          >
            {t('delete-file-confirm')}
          </ConfirmationDialog>
        </>
      )}
    </WithLoadingAndError>
  );
};

export default AllFiles;
