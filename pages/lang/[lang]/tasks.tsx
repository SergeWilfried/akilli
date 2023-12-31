import { CreateTask, Tasks } from '@/components/tasks';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import type { NextPageWithLayout } from 'types';

const AllTasks: NextPageWithLayout = () => {
  const [visible, setVisible] = useState(false);

  const router = useRouter();

  const { newTeam } = router.query as { newTeam: string };

  useEffect(() => {
    if (newTeam) {
      setVisible(true);
    }
  }, [newTeam, router.query]);

  return (
    <>
      <div className="flex items-center justify-between"></div>
      <CreateTask visible={visible} setVisible={setVisible} />
      <Tasks isAdmin={false} />
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

export default AllTasks;
