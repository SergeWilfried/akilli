import { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { Button } from 'react-daisyui';
import type { NextPageWithLayout } from 'types';
import { CreateLang, Languages } from '@/components/lang';

const AllLangs: NextPageWithLayout = () => {
  const [visible, setVisible] = useState(false);

  const { t } = useTranslation('common');

  return (
    <>
      <div className="flex items-center justify-between">
        <Button
          color="primary"
          size="md"
          variant="outline"
          onClick={() => {
            setVisible(!visible);
          }}
        >
          {t('create-lang')}
        </Button>
      </div>
      <CreateLang visible={visible} setVisible={setVisible} />
      <Languages />
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { locale }: GetServerSidePropsContext = context;

  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
};

export default AllLangs;
