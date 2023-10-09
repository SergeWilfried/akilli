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
import useTasks from 'hooks/useTasks';
import { tasksType } from '../../lib/permissions';
import { createFile } from '../../lib/storage/minio';
import DragAndDrop from '../dragAndDrop';
import useLanguages from '../../hooks/useLanguages';

const CreateTask = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) => {
  const { t } = useTranslation('common');
  const { mutateTasks } = useTasks();
  const router = useRouter();
  const [audioUrl, setAudioUrl] = useState(``);
  const audioElmRef = useRef(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const [files, setFiles] = useState<any>([]);
  const { languages } = useLanguages();
  const formik = useFormik<NewTaskInput>({
    initialValues: {
      language: languages?.[0].name ?? '',
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
        const irl = await handleFileUpload(files); // Call the handleFileUpload function
        console.log(`liens de fichier ${irl}`);
        let response: any;
        const links = irl?.split(`,`).filter((link) => link !== '');
        console.log('links', links?.length);

        if (links === undefined) {
          /* empty */
        }
        let task: Task;
        if (links !== undefined) {
          if (links?.length >= 1) {
            const filesList: any[] = [];
            for (let index = 0; index < links.length; index++) {
              const size = files[index]?.size;
              const type = files[index]?.type;
              const url = links[index];
              console.log(url);
              filesList?.push({
                url: url,
                contentSize: size,
                fileFormat: type,
              });
            }
            task = {
              language: values.language,
              type: values.type,
              name: values.name,
              status: 'CREATED',
              userId: '',
              createdAt: new Date(),
              files: filesList,
            };
            response = await axios.post<ApiResponse<Task>>('/api/tasks', {
              ...task,
            });
          } else {
            task = {
              language: values.language,
              type: values.type,
              name: values.name,
              status: 'CREATED',
              userId: '',
              createdAt: new Date(),
              files: [
                {
                  url: links,
                  contentSize: files[0].size,
                  fileFormat: files[0].type,
                },
              ],
            };
            response = await axios.post<ApiResponse<Task>>('/api/tasks', {
              ...task,
            });
          }
        }
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

  const handleFileUpload = async (files: File | File[]) => {
    try {
      let fileUrl = ``;
      const filesNumber = files.length;
      console.log(`Uploading files ${filesNumber}`);
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
          {t('create-task')}
        </Modal.Header>
        <Modal.Body>
          <div className="mt-2 flex flex-col space-y-4">
            <p>{t('create-task-desc')}</p>
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
                value={formik.values.language}
                onChange={(event) => {
                  formik.handleChange(event);
                  console.log('language', event.currentTarget);
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
                // defaultValue={formik.initialValues.type} // Update this line
                value={formik.values.type}
                onChange={(event) => {
                  formik.handleChange(event);
                  console.log('type', event.currentTarget);
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

export default CreateTask;
