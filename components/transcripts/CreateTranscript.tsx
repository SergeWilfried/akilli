import { getAxiosError } from '@/lib/common';
import axios from 'axios';
import { useFormik } from 'formik';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useRef, useState, useEffect } from 'react';
import { Button, Input, Modal } from 'react-daisyui';
import toast from 'react-hot-toast';
import {
  isValidFileType,
  type ApiResponse,
  type NewTaskInput,
  MAX_FILE_SIZE,
  Task,
} from 'types';
import * as Yup from 'yup';
import useTranscripts from 'hooks/useTranscripts';
import { tasksType } from '../../lib/permissions';
import { createFile } from '../../lib/storage/minio';
import DragAndDrop from '../dragAndDrop';
import useLanguages from '../../hooks/useLanguages';

const CreateTranscript = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) => {
  const { t } = useTranslation('common');
  const { mutateTasks } = useTranscripts();
  const router = useRouter();
  const [audioUrl, setAudioUrl] = useState(``);
  const audioElmRef = useRef(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const [files, setFiles] = useState<any>([]);
  const { languages } = useLanguages();
  const formik = useFormik<NewTaskInput>({
    initialValues: {
      language: '',
      name: ``,
      type: '',
      files: files,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Name is Required'),
      language: Yup.string().required('Language is Required'),
      type: Yup.string().required('Type Required'),
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
    onSubmit: async (values) => {
      try {
        /// FIXME: Handle multiple files
        const url = await handleFileUpload(values.files); // Call the handleFileUpload function
        console.log(url);
        const task: Task = {
          language: values.language,
          type: values.type,
          name: values.name,
          status: 'CREATED',
          userId: '',
          createdAt: new Date(),
        };
        const response = await axios.post<ApiResponse<Task>>(
          '/api/tasks',
          {
            ...task,
          }
        );

        const { data: teamCreated } = response.data;

        if (teamCreated) {
          toast.success(t('transcript-created'));
          mutateTasks();
          formik.resetForm();
          setVisible(false);
          router.push(`/tasks`);
        }
      } catch (error: any) {
        toast.error(getAxiosError(error));
      }
    },
  });

  useEffect(() => {
    setAudioUrl('');
  }, [formik.values.type]);

  const handleFileUpload = async (file) => {
    try {
      const fileUrl = await createFile(file);
      return fileUrl;
      // Do something with the file URL, such as saving it in state or sending it to a server
    } catch (error) {
      // Handle the error appropriately
      toast.error('An error occurred while handling the file upload.');
    }
  };

  function handleChange(e: any) {
    e.preventDefault();
    console.log('File has been added');
    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files);
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
          {t('create-transcript')}
        </Modal.Header>
        <Modal.Body>
          <div className="mt-2 flex flex-col space-y-4">
            <p>{t('members-of-a-team')}</p>
            <div className="flex justify-between space-x-3">
              <Input
                name="name"
                className="flex-grow"
                onChange={formik.handleChange}
                value={formik.values.name}
                placeholder={t('task-name')}
              />
            </div>
            <div className="flex justify-between space-x-3">
              <select
                className="select-bordered select flex-grow"
                name="language"
                defaultValue={t('select-lang')}
                onChange={(event) => {
                  formik.handleChange(event);
                }}
                required
              >
                {languages?.map((task) => (
                  <option value={task.name} key={task.id}>
                    {task.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-between space-x-3">
              <select
                className="select-bordered select flex-grow"
                name="type"
                defaultValue={t('select-task-type')}
                onChange={(event) => {
                  formik.handleChange(event);
                }}
                required
              >
                {tasksType.map((task) => (
                  <option value={task.name} key={task.id}>
                    {task.name}
                  </option>
                ))}
              </select>
            </div>
            <DragAndDrop
              handleChange={handleChange}
              openFileExplorer={openFileExplorer}
              removeFile={removeFile}
              inputRef={inputRef}
              files={files}
              dragActive={dragActive}
            />
            {audioUrl && (
              <div className="flex justify-between space-x-3">
                <audio
                  className="flex-grow"
                  src={audioUrl}
                  controls
                  ref={audioElmRef}
                />
              </div>
            )}
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

export default CreateTranscript;
