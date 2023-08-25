import { Error, InputWithLabel, Loading, SelectWithLabel } from '@/components/shared';
import { countryOptions, getAxiosError } from '@/lib/common';
import type { User } from '@prisma/client';
import axios from 'axios';
import { useFormik } from 'formik';
import useInvitation from 'hooks/useInvitation';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';
import type { ApiResponse } from 'types';
import * as Yup from 'yup';

const JoinWithInvitation = ({
  inviteToken,
  next,
}: {
  inviteToken: string;
  next: string;
}) => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const { isLoading, isError, invitation } = useInvitation(inviteToken);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: invitation?.email,
      password: '',
      country: '',
      mobileNumber: '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required().email(),
      country: Yup.string().required(),
      mobileNumber: Yup.string().required(),
      password: Yup.string()
        .required()
        .min(8, 'Password must be at least 8 characters long'),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await axios.post<ApiResponse<User>>('/api/auth/join', {
          ...values,
        });

        formik.resetForm();
        toast.success(t('successfully-joined'));

        return next ? router.push(next) : router.push('/auth/login');
      } catch (error: any) {
        toast.error(getAxiosError(error));
      }
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <form className="space-y-3" onSubmit={formik.handleSubmit}>
      <InputWithLabel
        type="text"
        label={t('name')}
        name="name"
        placeholder={t('your-name')}
        value={formik.values.name}
        error={formik.touched.name ? formik.errors.name : undefined}
        onChange={formik.handleChange}
      />
      <InputWithLabel
        type="text"
        label={t('mobile-number')}
        name="mobileNumber"
        placeholder={t('your-mobile-number')}
        value={formik.values.mobileNumber}
        error={
          formik.touched.mobileNumber ? formik.errors.mobileNumber : undefined
        }
        onChange={formik.handleChange}
      />
      <SelectWithLabel
        label={t('country')}
        name="country"
        options={countryOptions}
        value={formik.values.country}
        error={formik.touched.country ? formik.errors.country : undefined}
        onChange={formik.handleChange}
      />
      <InputWithLabel
        type="email"
        label={t('email')}
        name="email"
        placeholder={t('your-email')}
        value={formik.values.email}
        error={formik.touched.email ? formik.errors.email : undefined}
        onChange={formik.handleChange}
      />
      <InputWithLabel
        type="password"
        label={t('password')}
        name="password"
        placeholder={t('password')}
        value={formik.values.password}
        error={formik.touched.password ? formik.errors.password : undefined}
        onChange={formik.handleChange}
      />
      <Button
        type="submit"
        color="primary"
        loading={formik.isSubmitting}
        active={formik.dirty}
        fullWidth
        size="md"
      >
        {t('create-account')}
      </Button>
      <div>
        <p className="text-sm">{t('sign-up-message')}</p>
      </div>
    </form>
  );
};

export default JoinWithInvitation;
