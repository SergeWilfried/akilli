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
import { usePresignedUpload } from 'next-s3-upload';
import { useSession } from 'next-auth/react';
import { nanoid } from 'nanoid';

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
  const [urls, setUrls] = useState<any>([]);
  const { uploadToS3 } = usePresignedUpload();
  const { data } = useSession();

  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const [files, setFiles] = useState<any>([]);
  const formik = useFormik<any>({
    initialValues: {
      files: '',
      taskId: task ? task?.id : '',
      lang: task ? task?.language : '',
    },
    validationSchema: Yup.object().shape({
      files: Yup.array().of(
        Yup.mixed()
          .required()
          .test('is-valid-type', 'Not a valid file type', (value) =>
            isValidFileType((value as File)?.name?.toLowerCase(), 'audio')
          )
          .test(
            'is-valid-size',
            'Max allowed size is 1024KB',
            (value) => value && (value as File).size <= MAX_FILE_SIZE
          )
      ),
      taskId: Yup.string().required(),
      lang: Yup.string().required(),
    }),
    onSubmit: async () => {
      try {
        /// FIXME: Handle multiple files

        console.error(`urls`, urls);
        const response = await axios.post<ApiResponse<any>>(
          `/api/tasks/${task?.id}/files`,
          {
            taskId: task?.id,
            files: urls,
          }
        );

        const { data: teamCreated } = response.data;

        if (teamCreated) {
          toast.success(t('transcript-created'));
          mutateTasks();
          formik.resetForm();
          setVisible(false);
          router.push(`/teams/akilli/tasks/${task.id}/files`);
        }
      } catch (error: any) {
        toast.error(getAxiosError(error));
      }
    },
  });
  const handleFileChange = async (file: File) => {
    const _id = nanoid();
    const renamedFile = renameFile(file, _id);
    const { url, key } = await uploadToS3(renamedFile, {
      endpoint: {
        request: {
          body: formik.values,
          url: '/api/teams/akilli/upload',
          headers: {
            authorization: data ? data.user.id : '',
          },
        },
      },
    });
    const staeeb = {
      url,
      key,
      type: file.type,
    };
    setUrls((current) => [...current, staeeb]);
  };
  function handleChange(e: any) {
    e.preventDefault();
    console.log('File has been added');
    if (e.target.files && e.target.files[0]) {
      for (let i = 0; i < e.target.files['length']; i++) {
        setFiles((prevState: any) => [...prevState, e.target.files[i]]);
        handleFileChange(e.target.files[i]);
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

  function removeFile(fileName: any, idx: any) {
    const newArr = [...files];
    newArr.splice(idx, 1);
    setFiles([]);
    setFiles(newArr);
  }

  function openFileExplorer() {
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current?.click();
    }
  }
  return (
    <Modal open={visible}>
      <form
        method="POST"
        onDragEnter={handleDragEnter}
        onSubmit={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
      >
        <Modal.Header className="font-bold">
          {t('new-file-import')}
        </Modal.Header>
        <Modal.Body
          className={`${
            dragActive ? 'bg-blue-400' : 'bg-blue-100'
          }   w-full rounded-lg  min-h-[10rem] text-center flex flex-col items-center justify-center`}
        >
          <div className="mt-2 flex flex-col space-y-4">
            <p>{t('import-files-desc')}</p>
            <input
              type="file"
              className="hidden"
              accept=".wav,.mp3"
              multiple={true}
              ref={inputRef}
              onChange={handleChange}
            />
            <p>
              Drag & Drop files or{' '}
              <span
                className="font-bold text-blue-600 cursor-pointer"
                onClick={openFileExplorer}
              >
                <u>Select files</u>
              </span>{' '}
              to upload
            </p>
            <div className="flex flex-col items-center p-3">
              {files.map((file: any, idx: any) => (
                <div key={idx} className="flex flex-row space-x-5">
                  <span>{file.name}</span>
                  <span>
                    File #{idx} progress: {file.progress}%
                  </span>

                  <span
                    className="text-red-500 cursor-pointer"
                    onClick={() => removeFile(file.name, idx)}
                  >
                    remove
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
        <Modal.Actions>
          <Button
            type="submit"
            onClick={() => {
              formik.submitForm();
            }}
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

function renameFile(originalFile: File, newName) {
  const blob = originalFile.slice(0, originalFile?.size, originalFile?.type);
  return new File([blob], `${newName}.${originalFile?.type}`, {
    type: originalFile?.type,
  });
}
