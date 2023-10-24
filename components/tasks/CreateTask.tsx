import { getAxiosError } from '@/lib/common';
import axios from 'axios';
import { useFormik } from 'formik';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';
import { Button, Input, Modal } from 'react-daisyui';
import toast from 'react-hot-toast';
import { type ApiResponse, type NewTaskInput, Task } from 'types';
import * as Yup from 'yup';
import useTasks from 'hooks/useTasks';
import { tasksType } from '../../lib/permissions';
import useLanguages from '../../hooks/useLanguages';
import useTeam from '../../hooks/useTeam';

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

  const { languages } = useLanguages();
  const { team } = useTeam();
  const formik = useFormik<NewTaskInput>({
    initialValues: {
      language: languages?.[0]?.code ?? '',
      name: ``,
      type: '',
      files: [],
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Name is Required'),
      language: Yup.string().required('Language is Required'),
      type: Yup.string().required('Type Required'),
    }),
    onSubmit: async (values) => {
      try {
        /// FIXME: Handle multiple files
        const irl = 'http://'; // Call the handleFileUpload function
        console.log(`liens de fichier ${irl}`);
        let response: any;
        const links = irl?.split(`,`).filter((link) => link !== '');
        console.log('links', links?.length);

        if (links === undefined) {
          /* empty */
        }
        let task: any;
        if (links !== undefined) {
          task = {
            language: values.language,
            type: values.type,
            name: values.name,
            teamId: team ? team.id : '',
            status: 'CREATED',
            userId: '',
            createdAt: new Date(),
          };
          response = await axios.post<ApiResponse<Task>>('/api/tasks', {
            ...task,
          });
        }
        const { data: teamCreated } = response.data;

        if (teamCreated) {
          toast.success(t('transcript-created'));
          mutateTasks();
          formik.resetForm();
          setVisible(false);
          router.push(`/teams/akilli/tasks`);
        }
      } catch (error: any) {
        toast.error(getAxiosError(error));
      }
    },
  });

  return (
    <Modal open={visible}>
      <form onSubmit={formik.handleSubmit} method="POST">
        <Modal.Header className="font-bold">{t('create-task')}</Modal.Header>
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
                {languages?.map((lang) => (
                  <option value={lang.code} key={lang.id}>
                    {lang.name}
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
