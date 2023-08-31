import { Card, Error, LetterAvatar, Loading } from '@/components/shared';
import { getAxiosError } from '@/lib/common';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';
import { ApiResponse, Language } from 'types';

import ConfirmationDialog from '../shared/ConfirmationDialog';
import useLanguages from '../../hooks/useLanguages';

const Langs = () => {
  const { t } = useTranslation('common');
  const [team, setTeam] = useState<Language | null>(null);
  const { isLoading, isError, languages, mutateLanguages } = useLanguages();
  const [askConfirmation, setAskConfirmation] = useState(false);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  const leaveTeam = async (team: Language) => {
    try {
      await axios.delete<ApiResponse>(`/api/lang/${team.name}`);
      toast.success(t('delete-lang-success'));
      mutateLanguages();
    } catch (error: any) {
      toast.error(getAxiosError(error));
    }
  };

  return (
    <>
      <Card heading={t('all-teams')}>
        <Card.Body>
          <table className="w-full table-fixed text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  {t('name')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('members')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('created-at')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {languages &&
                languages.map((team) => {
                  return (
                    <tr
                      key={team.id}
                      className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                    >
                      <td className="px-6 py-3">
                        <Link href={`/lang/${team.name}/members`}>
                          <div className="flex items-center justify-start space-x-2">
                            <LetterAvatar name={team.name} />
                            <span className="underline">{team.name}</span>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-3">{team.description}</td>
                      <td className="px-6 py-3">
                        {new Date(team.createdAt).toDateString()}
                      </td>
                      <td className="px-6 py-3">
                        <Button
                          variant="outline"
                          size="xs"
                          color="error"
                          onClick={() => {
                            setTeam(team);
                            setAskConfirmation(true);
                          }}
                        >
                          {t('delete-lang')}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </Card.Body>
      </Card>
      <ConfirmationDialog
        visible={askConfirmation}
        title={`${t('delete-lang')} ${team?.name}`}
        onCancel={() => setAskConfirmation(false)}
        onConfirm={() => {
          if (team) {
            leaveTeam(team);
          }
        }}
        confirmText={t('delete-lang')}
      >
        {t('delete-lang-confirmation')}
      </ConfirmationDialog>
    </>
  );
};

export default Langs;
