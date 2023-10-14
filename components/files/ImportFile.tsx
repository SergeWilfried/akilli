import { getAxiosError } from '@/lib/common';
import axios from 'axios';
import { useFormik } from 'formik';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import { Button, Modal } from 'react-daisyui';
import toast from 'react-hot-toast';
import { isValidFileType, type ApiResponse, MAX_FILE_SIZE, Task } from 'types';
import * as Yup from 'yup';
import useTasks from 'hooks/useTasks';
import DragAndDrop from '../dragAndDrop';

const ImportFile = ({
  visible,
  setVisible,
  task,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  task: Task;
}) => {
  const { t } = useTranslation('common');
  const { mutateTasks } = useTasks();
  const router = useRouter();
  const inputRef = useRef<any>(null);
  const formik = useFormik<any>({
    initialValues: {
      files: '',
    },
    validationSchema: Yup.object().shape({
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
    onSubmit: async () => {
      try {
        /// FIXME: Handle multiple files

        const response = await axios.post<ApiResponse<any>>(
          `/api/tasks/${task?.id}/files`,
          {
            taskId: task?.id,
          }
        );

        const { data: teamCreated } = response.data;

        if (teamCreated) {
          toast.success(t('transcript-created'));
          mutateTasks();
          formik.resetForm();
          setVisible(false);
          router.push(`teams/akilli/tasks/${task.id}/files`);
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
          {t('new-file-import')}
        </Modal.Header>
        <Modal.Body>
          <div className="mt-2 flex flex-col space-y-4">
            <p>{t('import-files-desc')}</p>

            <DragAndDrop inputRef={inputRef} fields={formik.values} />
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

export default ImportFile;
