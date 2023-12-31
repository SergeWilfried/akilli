import { Card, InputWithLabel } from '@/components/shared';
import { getAxiosError } from '@/lib/common';
import { Task } from '@prisma/client';
import axios from 'axios';
import { useFormik } from 'formik';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';
import { Button, Input } from 'react-daisyui';
import toast from 'react-hot-toast';
import { type ApiResponse } from 'types';
import * as Yup from 'yup';

import { AccessControl } from '../shared/AccessControl';
import { TaskStatus, tasksType } from '../../lib/permissions';

const TasksDetails = ({ task }: { task: Task }) => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const formik = useFormik({
    initialValues: {
      name: task.name,
      status: task.status,
      language: task.language,
      type: task.type,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Name is required'),
      status: Yup.string().required('Slug is required'),
      language: Yup.string().nullable(),
      type: Yup.string().required(),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const response = await axios.put<ApiResponse<Task>>(
          `/api/tasks/${task.id}`,
          {
            ...values,
          }
        );

        const { data: taskUpdated } = response.data;

        if (taskUpdated) {
          toast.success(t('successfully-updated'));
          return router.push(`/teams/akilli/tasks/${taskUpdated.id}/settings`);
        }
      } catch (error: any) {
        toast.error(getAxiosError(error));
      }
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Card>
          <Card.Body>
            <Card.Header>
              <Card.Title>{t('task-settings')}</Card.Title>
              <Card.Description>
                Project settings and configuration.
              </Card.Description>
            </Card.Header>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between space-x-3">
                <InputWithLabel
                  name="name"
                  label={t('task-name')}
                  descriptionText={t('task-name')}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.errors.name}
                />
              </div>

              <select
                name="status"
                className="select-bordered select flex-grow"
                value={formik.values.status ? formik.values.status : 'STARTED'}
                onChange={formik.handleChange}
              >
                <option value="" disabled>
                  {t('select-status')}
                </option>
                {TaskStatus.map((status) => (
                  <option key={status.id} value={status.name}>
                    {status.name}
                  </option>
                ))}
              </select>
              <select
                name="type"
                className="select-bordered select flex-grow"
                value={
                  formik.values.type ? formik.values.type : 'VOICE TO TEXT'
                }
                onChange={formik.handleChange}
              >
                <option value="" disabled>
                  {t('select-type')}
                </option>
                {tasksType.map((status) => (
                  <option key={status.id} value={status.name}>
                    {status.name}
                  </option>
                ))}
              </select>
                <Input
                  name="language"
                  placeholder={t('task-name')}
                  value={formik.values.language.toUpperCase()}
                  onChange={formik.handleChange}
                />

           
            </div>
          </Card.Body>
          <AccessControl resource="task" actions={['update']}>
            <Card.Footer>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  color="primary"
                  loading={formik.isSubmitting}
                  disabled={!formik.isValid || !formik.dirty}
                  size="md"
                >
                  {t('save-changes')}
                </Button>
              </div>
            </Card.Footer>
          </AccessControl>
        </Card>
      </form>
    </>
  );
};

export default TasksDetails;
