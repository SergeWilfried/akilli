import { getAxiosError } from '@/lib/common';
import axios from 'axios';
import { useFormik } from 'formik';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import { Button, Modal, Textarea } from 'react-daisyui';
import toast from 'react-hot-toast';
import { type ApiResponse, type Task } from 'types';
import * as Yup from 'yup';
import useTasks from 'hooks/useTasks';
import { InputWithLabel } from '../shared';
import { sentences_detailed } from '@prisma/client';
import AudioRecorder from '../AudioRecorder';
import AudioPlayer from '../AudioPlayer';
import { usePresignedUpload } from 'next-s3-upload';
import { nanoid } from 'nanoid';
import { renameFile } from '../files/ImportFile';
interface IOnFinish {
  id: string;
  audio: Blob;
}
import { TrashIcon } from '@heroicons/react/24/outline';
interface IMessage {
  id: string;
  audio: Blob;
}

const RecordVoiceTranscript = ({
  visible,
  setVisible,
  task,
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { uploadToS3, files, resetFiles } = usePresignedUpload();
  const [url, setUrl] = useState<string>('');
  const [urls, setUrls] = useState<any>([]);

  const formik = useFormik<any>({
    initialValues: {
      language: task?.language ?? '',
      text: sentence ? sentence?.text : '',
      file: '',
    },
    validationSchema: Yup.object().shape({
      text: Yup.string().optional(),
      language: task
        ? Yup.string().optional()
        : Yup.string().optional(),
      file: Yup.mixed().optional(),
    }),
    onSubmit: async (values) => {
      const response = await axios.post<ApiResponse<any>>(
        `/api/tasks/${task?.id}/files`,
        {
          taskId: task?.id,
          files: urls,
        }
      );

      const { data: fileCreated } = response.data;

      if (fileCreated) {
        try {
          const payload = {
            language: values.language,
            text: values.text,
            fileId: fileCreated?.id,
            taskId: task ? task.id : '',
            audioFileUrl: urls,
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

  const onFinish = async ({ id, audio }: IOnFinish) => {
    setMessages((prevMessages) => [...prevMessages, { id, audio }]);
    const fileName = 'audio-recording';
    const _id = nanoid();
    const file = new File([audio], fileName);
    formik.setFieldValue('file', file)
    const renamedFile = renameFile(file, _id);

    const { url, key } = await uploadToS3(renamedFile, {
      endpoint: {
        request: {
          body: {
            lang: task?.language,
            taskId: task?.id,
            files: [renamedFile],
          },
          url: '/api/teams/akilli/upload',
          headers: {},
        },
      },
    });
    setUrl(url);
    const staeeb = {
      url,
      key,
      type: file.type,
      contentSize: file.size,
    };
    setUrls((current) => [...current, staeeb]);
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

            <div className="bg-gray-600 p-2 flex flex-row gap-5">
              {url &&
                 (
                  <AudioPlayer
                    key={messages[0]?.id}
                    url={null}
                    audio={messages[0]?.audio}
                  />
                )}
              <div>
                <AudioRecorder onFinish={onFinish} />
                <Button
                  variant="outline"
                  size="xs"
                  shape="circle"
                  color="error"
                  onClick={() => {}}
                >
                  <TrashIcon />
                </Button>
              </div>
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
              value={sentence ? sentence.text! : ''}
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
           Save Transcription
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
