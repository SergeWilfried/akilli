import { Card } from '@/components/shared';
import { GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { NextPageWithLayout } from 'types';

const Dashboard: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const { data: session } = useSession();

  return (
    <Card heading="Dashboard">
      <Card.Body>
        <div className="p-3">
          <p className="text-sm">
            {`${t('hi')}, ${session?.user.name} ${t(
              'you-have-logged-in-using'
            )} ${session?.user.email}`}
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
}

export default Dashboard;
