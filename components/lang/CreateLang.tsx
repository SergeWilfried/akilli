import { getAxiosError } from '@/lib/common';
import axios from 'axios';
import { useFormik } from 'formik';
import useTeams from 'hooks/useTeams';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';
import { Button, Input, Modal } from 'react-daisyui';
import toast from 'react-hot-toast';
import type { ApiResponse, Language } from 'types';
import * as Yup from 'yup';

const CreateLang = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) => {
  const { t } = useTranslation('common');
  const { mutateTeams } = useTeams();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required(),
      description: Yup.string().required(),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post<ApiResponse<Language>>('/api/lang/', {
          ...values,
        });

        const { data: teamCreated } = response.data;

        if (teamCreated) {
          toast.success(t('team-created'));
          mutateTeams();
          formik.resetForm();
          setVisible(false);
          router.push(`/langs`);
        }
      } catch (error: any) {
        toast.error(getAxiosError(error));
      }
    },
  });

  return (
    <Modal open={visible}>
      <form onSubmit={formik.handleSubmit} method="POST">
        <Modal.Header className="font-bold">{t('create-team')}</Modal.Header>
        <Modal.Body>
          <div className="mt-2 flex flex-col space-y-4">
            <p>{t('members-of-a-team')}</p>
            <div className="flex justify-between space-x-3">
              <Input
                name="name"
                className="flex-grow"
                onChange={formik.handleChange}
                value={formik.values.name}
                placeholder={t('lang-name')}
              />
            </div>
            <div className="flex justify-between space-x-3">
              <Input
                name="description"
                className="flex-grow"
                onChange={formik.handleChange}
                value={formik.values.description}
                placeholder={t('lang-description')}
              />
            </div>
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
            {t('create-lang')}
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

export default CreateLang;
