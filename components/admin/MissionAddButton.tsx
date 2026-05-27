'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import MissionDialog from '@/components/admin/MissionDialog';
import { Mission } from '@/types/mission';
import { useCreateAdminMissionMutation } from '@/features/admin/missions/adminMissionMutations';
import { useParams } from 'next/navigation';

type Props = {
  disabled?: boolean;
};

export default function MissionAddButton({ disabled }: Props) {
  const eventId = Number(useParams().eventId);
  const [isAdding, setIsAdding] = useState(false);
  const { mutate: createAdminMission } = useCreateAdminMissionMutation();
  const queryClient = useQueryClient();

  const handleSave = (payload: Mission) => {
    createAdminMission(
      { eventId, payload },
      {
        onSuccess: () => {
          setIsAdding(false);
          queryClient.invalidateQueries({
            queryKey: ['admin', 'events', eventId, 'missions'],
          });
        },
      }
    );
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsAdding(true)}
        disabled={disabled}
      >
        + 미션 추가
      </Button>

      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <MissionDialog
          key={String(isAdding)}
          mission={{ title: '', description: '', isActive: false }}
          onSave={handleSave}
        />
      </Dialog>
    </>
  );
}
