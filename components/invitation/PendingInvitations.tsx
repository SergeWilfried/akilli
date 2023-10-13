import { Error, LetterAvatar, Loading } from '@/components/shared';
import { Invitation, Team } from '@prisma/client';
import axios from 'axios';
import useInvitations from 'hooks/useInvitations';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';
import { ApiResponse } from 'types';
import ConfirmationDialog from '../shared/ConfirmationDialog';

const PendingInvitations = ({ team }: { team: Team }) => {
  const { isLoading, isError, invitations, mutateInvitation } = useInvitations(
    team.slug
  );
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);

  const { t } = useTranslation('common');
  const [confirmationDialogVisible, setConfirmationDialogVisible] =
    useState(false);
  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  const deleteInvitation = async (invitation: Invitation) => {
    // const sp = new URLSearchParams({ id: invitation.id });
    const { data: response } = await axios.delete<ApiResponse<unknown>>(
      `/api/teams/${team.slug}/invitations/${invitation.id}`,
      {
        validateStatus: () => true,
      }
    );

    if (response.error) {
      toast.error(response.error.message);
    }

    if (response.data) {
      mutateInvitation();
      toast.success(t('invitation-deleted'));
    }
  };

  if (!invitations || !invitations.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <h2 className="text-xl font-medium leading-none tracking-tight">
          Pending Invitations
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Invitations that have been sent to users but have not yet been
          accepted.
        </p>
      </div>
      <table className="text-sm table w-full border-b dark:border-base-200">
        <thead className="bg-base-200">
          <tr>
            <th colSpan={2}>{t('email')}</th>
            <th>{t('role')}</th>
            <th>{t('created-at')}</th>
            <th>{t('action')}</th>
          </tr>
        </thead>
        <tbody>
          {invitations.map((invitation) => {
            return (
              <tr key={invitation.token}>
                <td colSpan={2}>
                  <div className="flex items-center justify-start space-x-2">
                    <LetterAvatar name={invitation.email} />
                    <span>{invitation.email}</span>
                  </div>
                </td>
                <td>{invitation.role}</td>
                <td>{new Date(invitation.createdAt).toDateString()}</td>
                <td>
                  <Button
                    size="xs"
                    color="error"
                    variant="outline"
                    onClick={() => {
                      setSelectedInvitation(invitation);
                      setConfirmationDialogVisible(true);
                    }}
                  >
                    {t('remove')}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <ConfirmationDialog
        visible={confirmationDialogVisible}
        onCancel={() => setConfirmationDialogVisible(false)}
        onConfirm={() => deleteInvitation(selectedInvitation)}
        title={t('confirm-delete-member-invitation')}
      >
        {t('delete-member-invitation-warning')}
      </ConfirmationDialog>
    </div>
  );
};

export default PendingInvitations;
