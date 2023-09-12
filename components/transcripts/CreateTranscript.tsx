import { getAxiosError } from '@/lib/common';
import type { Team } from '@prisma/client';
import axios from 'axios';
import { useFormik } from 'formik';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useRef, useState, useEffect } from 'react';
import { Button, Input, Modal, Select } from 'react-daisyui';
import toast from 'react-hot-toast';
import {
  isValidFileType,
  type ApiResponse,
  type NewTaskInput,
  MAX_FILE_SIZE,
} from 'types';
import * as Yup from 'yup';
import useTranscripts from 'hooks/useTranscripts';
import { tasksType } from '../../lib/permissions';

const CreateTranscript = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) => {
  const { t } = useTranslation('common');
  const { mutateTranscripts } = useTranscripts();
  const router = useRouter();
  const [audioUrl, setAudioUrl] = useState(``);
  const audioElmRef = useRef(null);

  const formik = useFormik<NewTaskInput>({
    initialValues: {
      deadline: new Date(),
      language: 'French',
      name: `Task #1`,
      fileFormat: '',
      contentSize: '',
      type: '',
      file: undefined,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required(),
      deadline: Yup.date().optional(),
      language: Yup.string().required(),
      fileFormat: Yup.string().optional(),
      contentSize: Yup.number().optional(),
      type: Yup.string().required(),
      file: Yup.mixed()
        .required('Required')
        .test('is-valid-type', 'Not a valid file type', (value) =>
          isValidFileType((value as File)?.name?.toLowerCase(), 'audio')
        )
        .test(
          'is-valid-size',
          'Max allowed size is 1024KB',
          (value) => value && (value as File).size <= MAX_FILE_SIZE
        ),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post<ApiResponse<Team>>('/api/teams/', {
          ...values,
        });

        const { data: teamCreated } = response.data;

        if (teamCreated) {
          toast.success(t('transcript-created'));
          mutateTranscripts();
          formik.resetForm();
          setVisible(false);
          router.push(`/teams/${teamCreated.slug}/settings`);
        }
      } catch (error: any) {
        toast.error(getAxiosError(error));
      }
    },
  });

  useEffect(() => {
    setAudioUrl('');
  }, [formik.values.type]);

  return (
    <Modal open={visible}>
      <form onSubmit={formik.handleSubmit} method="POST">
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
                placeholder={t('team-name')}
              />
            </div>
            <div className="flex justify-between space-x-3">
              <Input
                name="language"
                className="flex-grow"
                onChange={formik.handleChange}
                value={formik.values.language}
                placeholder={t('task-lang')}
              />
            </div>
            <div className="flex justify-between space-x-3">
              <Select
                className="select-bordered select flex-grow"
                name="type"
                onChange={formik.handleChange}
                value={formik.values.type}
                required
              >
                {tasksType.map((task) => (
                  <option value={task.name} key={task.id}>
                    {task.value}
                  </option>
                ))}
              </Select>
            </div>
            {formik.values.type === 'SPEECH_TO_TEXT' && (
              <div className="flex justify-between space-x-3">
                <input
                  type="file"
                  name="file"
                  className="file-input file-input-bordered flex-grow"
                  onChange={(event) => {
                    if (event.currentTarget.files) {
                      const file = event.currentTarget.files?.[0];

                      if (!file) return;
                      setAudioUrl(URL.createObjectURL(file));
                      formik.setFieldValue(
                        'file',
                        event.currentTarget.files[0]
                      );
                    }
                  }}
                />
              </div>
            )}
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
            active={formik.dirty}
            size="md"
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
