import { getAxiosError } from '@/lib/common';
import axios from 'axios';
import { useFormik } from 'formik';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { Button, Modal } from 'react-daisyui';
import toast from 'react-hot-toast';
import { isValidFileType, type ApiResponse, MAX_FILE_SIZE, Task } from 'types';
import * as Yup from 'yup';
import useTasks from 'hooks/useTasks';
import { createFile } from '../../lib/storage/minio';
import DragAndDrop from '../dragAndDrop';

const ImportFile = ({
  visible,
  setVisible,
  task,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  task: Task;
}) => {
  const { t } = useTranslation('common');
  const { mutateTasks } = useTasks();
  const router = useRouter();
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const [files, setFiles] = useState<any>([]);
  const formik = useFormik<any>({
    initialValues: {
      files: files,
    },
    validationSchema: Yup.object().shape({
      files: Yup.array().of(
        Yup.mixed()
          .optional()
          .test('is-valid-type', 'Not a valid file type', (value) =>
            isValidFileType((value as File)?.name?.toLowerCase(), 'audio')
          )
          .test(
            'is-valid-size',
            'Max allowed size is 1024KB',
            (value) => value && (value as File).size <= MAX_FILE_SIZE
          )
      ),
    }),
    onSubmit: async () => {
      try {
        /// FIXME: Handle multiple files
        const irl = await handleFileUpload(files); // Call the handleFileUpload function

        let response;
        const links = irl?.split(`,`).filter((link) => link !== '');

        if (links !== undefined) {
          if (links?.length >= 1) {
            const filesList: any[] = [];
            for (let index = 0; index < links.length; index++) {
              const size = files[index]?.size;
              const type = files[index]?.type;
              const url = links[index];
              filesList?.push({
                url: url,
                contentSize: size,
                fileFormat: type,
              });
            }

            response = await axios.post<ApiResponse<any>>(
              `/api/tasks/${task?.id}/files`,
              {
                taskId: task?.id,
                files: filesList,
              }
            );
            const { data: teamCreated } = response.data;

            if (teamCreated) {
              toast.success(t('transcript-created'));
              mutateTasks();
              formik.resetForm();
              setVisible(false);
              router.push(`/tasks/${task.id}/files`);
            }
          } else {
            const list = [
                {
                  url: links,
                  contentSize: files[0].size,
                  fileFormat: files[0].type,
                },
              ],
              response = await axios.post<ApiResponse<any>>(
                `/api/tasks/${task?.id}/files`,
                {
                  taskId: task?.id,
                  ...list,
                }
              );

            const { data: teamCreated } = response.data;

            if (teamCreated) {
              toast.success(t('transcript-created'));
              mutateTasks();
              formik.resetForm();
              setVisible(false);
              router.push(`teams/akilli/tasks/${task.id}/files`);
            }
          }
        }
      } catch (error: any) {
        toast.error(getAxiosError(error));
      }
    },
  });

  const handleFileUpload = async (files: File | File[]) => {
    try {
      let fileUrl = ``;
      const filesNumber = files.length;
      if (filesNumber > 1) {
        for (let index = 0; index < filesNumber; index++) {
          const url = await createFile(files[index]);
          fileUrl += `,${url}`;
        }
        return fileUrl;
      } else {
        return await createFile(files[0]);
      }
    } catch (error) {
      // Handle the error appropriately
      toast.error('An error occurred while handling the file upload.');
    }
  };

  function handleChange(e: any) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      for (let i = 0; i < e.target.files['length']; i++) {
        setFiles((prevState: any) => [...prevState, e.target.files[i]]);
      }
    }
  }

  function handleDrop(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      for (let i = 0; i < e.dataTransfer.files['length']; i++) {
        setFiles((prevState: any) => [...prevState, e.dataTransfer.files[i]]);
      }
    }
  }

  function handleDragLeave(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleDragOver(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragEnter(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function openFileExplorer() {
    inputRef.current.value = '';
    inputRef.current.click();
  }

  function removeFile(fileName: any, idx: any) {
    const newArr = [...files];
    newArr.splice(idx, 1);
    setFiles([]);
    setFiles(newArr);
  }

  return (
    <Modal open={visible}>
      <form
        onSubmit={formik.handleSubmit}
        method="POST"
        onDragEnter={handleDragEnter}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
      >
        <Modal.Header className="font-bold">
          {t('new-file-import')}
        </Modal.Header>
        <Modal.Body>
          <div className="mt-2 flex flex-col space-y-4">
            <p>{t('import-files-desc')}</p>

            <DragAndDrop
              handleChange={handleChange}
              openFileExplorer={openFileExplorer}
              removeFile={removeFile}
              inputRef={inputRef}
              files={files}
              dragActive={dragActive}
            />
          </div>
        </Modal.Body>
        <Modal.Actions>
          <Button
            type="submit"
            color="primary"
            loading={formik.isSubmitting}
            size="md"
            disabled={!formik.isValid}
          >
            {t('create-team')}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setVisible(!visible);
            }}
            size="md"
          >
            {t('close')}
          </Button>
        </Modal.Actions>
      </form>
    </Modal>
  );
};

export default ImportFile;
