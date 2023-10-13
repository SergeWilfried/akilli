import { Card } from '@/components/shared';
import { Task } from '@prisma/client';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';

import ConfirmationDialog from '../shared/ConfirmationDialog';

const RemoveTask = ({ task }: { task: Task }) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState(false);
  const [askConfirmation, setAskConfirmation] = useState(false);

  const removeTeam = async () => {
    setLoading(true);

    const response = await axios.delete(`/api/tasks/${task.id}`);

    setLoading(false);

    const { data, error } = response.data;

    if (error) {
      toast.error(error.message);
      return;
    }

    if (data) {
      toast.success(t('task-removed-successfully'));
      return router.push('/tasks');
    }
  };

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Header>
            <Card.Title>{t('remove-task')}</Card.Title>
          </Card.Header>
          <p className="text-sm mb-4">{t('remove-task-warning')}</p>
          <Button
            color="error"
            onClick={() => setAskConfirmation(true)}
            loading={loading}
            variant="outline"
            size="md"
          >
            {t('remove-task')}
          </Button>
        </Card.Body>
      </Card>
      <ConfirmationDialog
        visible={askConfirmation}
        title={t('remove-task')}
        onCancel={() => setAskConfirmation(false)}
        onConfirm={removeTeam}
      >
        {t('remove-task-confirmation')}
      </ConfirmationDialog>
    </>
  );
};

export default RemoveTask;
