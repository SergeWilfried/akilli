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
import { csvParser } from '../../lib/parser';
import { InputWithLabel } from '../shared';
import { sentences_detailed } from '@prisma/client';

const CreateTranscript = ({
  visible,
  setVisible,
  isVoiceJob,
  withDataImport,
  task,
  audioFileUrl,
  sentence,
  desiredAction,
  onConfirm,
}: {
  visible: boolean;
  isVoiceJob: boolean;
  task: Task;
  sentence: sentences_detailed | undefined;
  withDataImport: boolean;
  onConfirm: () => void | Promise<any>;
  desiredAction: string | undefined;
  audioFileUrl: string | undefined;
  setVisible: (visible: boolean) => void;
}) => {
  const { t } = useTranslation('common');
  const { mutateTasks } = useTasks();
  const formik = useFormik<any>({
    initialValues: {
      language: task?.language ?? '',
      text: sentence ? sentence?.text : '',
      file: '',
    },
    validationSchema: Yup.object().shape({
      text: Yup.string().required('Name is Required'),
      language: sentence
        ? Yup.string().required('Language is Required')
        : Yup.string().optional(),
      file: Yup.mixed().optional(),
    }),
    onSubmit: async (values) => {
      if (isVoiceJob && audioFileUrl) {
        try {
          const payload = {
            language: values.language,
            text: values.text,
            taskId: task ? task.id : '',
            audioFileUrl: audioFileUrl,
            createdAt: new Date(),
          };

          const response = await axios.post<ApiResponse<any>>(
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
      } else {
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
          let response;

          if (desiredAction === 'update') {
            response = await axios.put<ApiResponse<sentences_detailed>>(
              `/api/tasks/${task.id}/sentences/${sentence?.sentence_id}`,
              {
                ...payload,
              }
            );
          }
          response = await axios.post<ApiResponse<sentences_detailed>>(
            `/api/tasks/${task.id}/sentences`,
            {
              ...payload,
            }
          );
          const { data: teamCreated } = response.data;

          if (teamCreated) {
            toast.success(t('sentence-created'));
            mutateTasks();
            formik.resetForm();
            setVisible(false);
          }
          onConfirm();
        } catch (error: any) {
          toast.error(getAxiosError(error));
        }
      }
    },
  });

  const changeHandler = async (event) => {
    await csvParser(event.target.files[0]);
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

            {isVoiceJob && audioFileUrl && (
              <>
                <audio controls style={{ width: '100%' }}>
                  <source src={audioFileUrl} type="audio/mpeg" />
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
              id="text"
              onChange={formik.handleChange}
              value={formik.values.text}
              rows={3}
              placeholder={t('type-here')}
              className="textarea textarea-bordered textarea-lg "
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Actions>
          {isVoiceJob ? (
            <Button
              type="submit"
              color="primary"
              loading={formik.isSubmitting}
              size="md"
              disabled={!formik.isValid}
            >
              {t('transcribe-audio')}
            </Button>
          ) : (
            <Button
              type="submit"
              color="primary"
              loading={formik.isSubmitting}
              size="md"
              disabled={!formik.isValid}
            >
              {sentence ? 'Update Sentence' : 'Add new Sentence'}
            </Button>
          )}

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
