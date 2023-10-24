import { getAxiosError } from '@/lib/common';
import axios from 'axios';
import { useFormik } from 'formik';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { Button, Modal } from 'react-daisyui';
import toast from 'react-hot-toast';
import { type ApiResponse, type Task } from 'types';
import * as Yup from 'yup';
import useTasks from 'hooks/useTasks';
import useLanguages from '../../hooks/useLanguages';
import { csvParser } from '../../lib/parser';
import { InputWithLabel } from '../shared';
import { sentences_detailed } from '@prisma/client';

const CreateTranscript = ({
  visible,
  setVisible,
  isVoiceJob,
  withDataImport,
  task,
}: {
  visible: boolean;
  isVoiceJob: boolean;
  task: Task;
  withDataImport: boolean;
  setVisible: (visible: boolean) => void;
}) => {
  const { t } = useTranslation('common');
  const { mutateTasks } = useTasks();
  const url = 'https://';
  const { languages } = useLanguages();
  const formik = useFormik<any>({
    initialValues: {
      language: languages?.[0]?.code ?? '',
      text: ``,
      file: '',
    },
    validationSchema: Yup.object().shape({
      text: Yup.string().required('Name is Required'),
      language: Yup.string().required('Language is Required'),
      file: Yup.mixed().optional(),
    }),
    onSubmit: async (values) => {
      try {
        if (values.files) {
          /* empty */
        }
        const payload = {
          language: values.language,
          text: values.text,
          taskId: task ? task.id : '',
          createdAt: new Date(),
        };
        const response = await axios.post<ApiResponse<sentences_detailed>>(
          `/api/tasks/${task.id}/transcripts`,
          {
            ...payload,
          }
        );

        const { data: teamCreated } = response.data;

        if (teamCreated) {
          toast.success(t('transcript-created'));
          mutateTasks();
          formik.resetForm();
          setVisible(false);
        }
      } catch (error: any) {
        toast.error(getAxiosError(error));
      }
    },
  });

  const changeHandler = async (event) => {
    const reee = await csvParser(event.target.files[0]);
    console.log('reee', reee);
  };

  return (
    <Modal open={visible}>
      <form onSubmit={formik.handleSubmit} method="POST">
        <Modal.Header className="font-bold">
          {isVoiceJob ? t('transcribe-audio') : 'Add new Sentence'}
        </Modal.Header>
        <Modal.Body>
          <div className="mt-2 flex flex-col space-y-4">
            <p>
              {isVoiceJob
                ? t('transcribe-audio-desc')
                : t('transcribe-sentence-desc')}
            </p>

            {isVoiceJob && (
              <>
                <audio controls style={{ width: '100%' }}>
                  <source src={url} type="audio/mpeg" />
                  {t('browser-not-supported')}
                </audio>
              </>
            )}

            {withDataImport && (
              <>
                <input
                  type="file"
                  name="file"
                  accept=".csv"
                  onChange={changeHandler}
                  style={{ display: 'block', margin: '10px auto' }}
                />
              </>
            )}
            <InputWithLabel
              type="text"
              name="language"
              label="Language"
              disabled={true}
              value={task.language}
            />
            <textarea
              name="text"
              id="sentences"
              onChange={formik.handleChange}
              value={formik.values.text}
              rows={3}
              placeholder={t('type-here')}
              className="textarea textarea-bordered textarea-lg "
            ></textarea>
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
            {isVoiceJob ? t('transcribe-audio') : 'Add new Sentence'}
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
