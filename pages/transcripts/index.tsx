import { CreateTranscript, Transcripts } from '@/components/transcripts';
import { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import type { NextPageWithLayout } from 'types';

const AllTranscripts: NextPageWithLayout = () => {
  const [visible, setVisible] = useState(false);

  const router = useRouter();
  const { t } = useTranslation('common');

  const { newTeam } = router.query as { newTeam: string };

  useEffect(() => {
    if (newTeam) {
      setVisible(true);
    }
  }, [router.query]);

  return (
    <>
      <div className="flex items-center justify-between">
        <h4>{t('all-transcripts')}</h4>
    
      </div>
      <CreateTranscript visible={visible} setVisible={setVisible} />
      <Transcripts />
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

export default AllTranscripts;
