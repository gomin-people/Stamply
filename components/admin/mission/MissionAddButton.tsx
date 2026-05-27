'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import MissionDialog from '@/components/admin/mission/MissionDialog';
import { Mission } from '@/types/mission';
import { useCreateAdminMissionMutation } from '@/features/admin/missions/adminMissionMutations';
import { useParams } from 'next/navigation';

type Props = {
  disabled?: boolean;
};

export default function MissionAddButton({ disabled }: Props) {
  const eventId = Number(useParams().eventId);
  const [isAdding, setIsAdding] = useState(false);
  const { mutateAsync: createAdminMissionAsync } =
    useCreateAdminMissionMutation();
  const queryClient = useQueryClient();

  const handleSave = async (payload: Mission): Promise<void> => {
    try {
      await createAdminMissionAsync({ eventId, payload });
      queryClient.invalidateQueries({
        queryKey: ['admin', 'events', eventId, 'missions'],
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsAdding(false);
    }
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
          mission={{ title: '', description: '', isActive: false }}
          onSave={handleSave}
        />
      </Dialog>
    </>
  );
}
