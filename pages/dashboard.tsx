import { Card } from '@/components/shared';
import { GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { NextPageWithLayout } from 'types';
import useTeams from '../hooks/useTeams';
import { useRouter } from 'next/router';

const Dashboard: NextPageWithLayout = () => {
  const router = useRouter();
  const { teams } = useTeams();
  const { t } = useTranslation('common');
  const { data: session } = useSession();

  if (teams) {
    if (teams.length > 0) {
     
        router.push(`/dashboard`);
      
    } else {
      router.push('teams?newTeam=true');
    }
  }

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

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
}

export default Dashboard;
