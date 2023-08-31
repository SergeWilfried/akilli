import { CreateTeam, Teams } from '@/components/team';
import { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { Button } from 'react-daisyui';
import type { NextPageWithLayout } from 'types';

const AllLangs: NextPageWithLayout = () => {
  const [visible, setVisible] = useState(true);

  const { t } = useTranslation('common');

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
      <CreateTeam visible={visible} setVisible={setVisible} />
      <Teams />
    </>
  );
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
}

export default AllLangs;
