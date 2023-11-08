import { getAxiosError } from '@/lib/common';
import axios from 'axios';
import { useFormik } from 'formik';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { Button, Modal, Textarea } from 'react-daisyui';
import toast from 'react-hot-toast';
import { type ApiResponse, type Task } from 'types';
import * as Yup from 'yup';
import useTasks from 'hooks/useTasks';
import { InputWithLabel } from '../shared';
import { sentences_detailed } from '@prisma/client';
import AudioRecorder from '../AudioRecorder';
import AudioPlayer from '../AudioPlayer';
interface IOnFinish {
  id: string;
  audio: Blob;
}

interface IMessage {
  id: string;
  audio: Blob;
}

const RecordVoiceTranscript = ({
  visible,
  setVisible,
  task,
  audioFileUrl,
  sentence,
}: {
  visible: boolean;
  task: Task;
  sentence: sentences_detailed | undefined;
  audioFileUrl: string | undefined;
  setVisible: (visible: boolean) => void;
}) => {
  const { t } = useTranslation('common');
  const { mutateTasks } = useTasks();
  const url = 'https://';
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
      if (audioFileUrl) {
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
          console.log(`transcript`, teamCreated);
          if (teamCreated) {
            toast.success(t('transcript-created'));
            mutateTasks();
            formik.resetForm();
            setVisible(false);
          }
        } catch (error: any) {
          toast.error(getAxiosError(error));
        }
      }
    },
  });
  const [messages, setMessages] = React.useState<IMessage[]>([]);

  const onFinish = ({ id, audio }: IOnFinish) => {
    setMessages((prevMessages) => [...prevMessages, { id, audio }]);
  };
  return (
    <Modal open={visible}>
      <form onSubmit={formik.handleSubmit} method="POST">
        <Modal.Header className="font-bold">
          Record New Transcription
        </Modal.Header>
        <Modal.Body>
          <div className="mt-2 flex flex-col space-y-4">
            <p>{t('transcribe-sentence-desc')}</p>

            <div className="bg-gray-600 p-2 flex-1 flex flex-col gap-5">
              {messages &&
                messages.map(({ id, audio }) => (
                  <AudioPlayer key={id} audio={audio} />
                ))}
                                          <AudioRecorder onFinish={onFinish} />

            </div>
            <div className=" flex gap-5">
              <InputWithLabel
                type="text"
                name="language"
                label="Language"
                disabled={true}
                value={task.language}
              />
            
            </div>
            <Textarea
                name="text"
                className="flex-grow"
                disabled={true}
                value={sentence ? sentence.text!: ''}
                                  rows={4}

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
            {sentence ? 'Update Sentence' : 'Add new Sentence'}
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

export default RecordVoiceTranscript;
