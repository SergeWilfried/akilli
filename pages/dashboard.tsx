import { Card } from '@/components/shared';
import { GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import router from 'next/router';
import { useEffect } from 'react';
import type { NextPageWithLayout } from 'types';
import useTeams from '../hooks/useTeams';
import { Role } from '@prisma/client';

const Dashboard: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const { data: session } = useSession();
  const { teams, isLoading } = useTeams();

  useEffect(() => {
    if (isLoading || !teams) {
      return;
    }

    if (teams.length > 0) {
      router.push(`/teams/${teams[0].slug}/settings`);
    } else if (teams[0]?.defaultRole === Role.OWNER) {
      router.push('teams?newTeam=true');
    }
  }, [isLoading, router, teams]);

  return (
    <Card>
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
