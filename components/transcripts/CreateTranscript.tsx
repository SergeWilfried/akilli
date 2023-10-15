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
import useTeam from '../../hooks/useTeam';

const CreateTranscript = ({
  visible,
  setVisible,
  isVoiceJob,
}: {
  visible: boolean;
  isVoiceJob: boolean;
  setVisible: (visible: boolean) => void;
}) => {
  const { t } = useTranslation('common');
  const { mutateTasks } = useTasks();
  const url = 'https://';
  const { languages } = useLanguages();
  const { team } = useTeam();
  const formik = useFormik<any>({
    initialValues: {
      language: languages?.[0].name ?? '',
      text: ``,
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
          response = await axios.post<ApiResponse<Task>>('/api/transcripts', {
            ...task,
          });
        }
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

            <textarea
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
