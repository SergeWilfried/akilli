import { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Button } from 'react-daisyui';
import type { NextPageWithLayout } from 'types';
import { Languages, CreateLang } from '@/components/lang';
import { useState } from 'react';

const Language: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <h4>{t('all-lang')}</h4>
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
      <div className="space-y-6">
        <CreateLang visible={visible} setVisible={setVisible} />
        <Languages />
      </div>
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

export default Language;
