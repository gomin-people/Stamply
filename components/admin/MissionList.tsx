'use client';

import { useState } from 'react';
import { GripVertical, Pencil, Trash2, QrCode } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import type { AdminMissionDetail } from '@/types/models/admin';
import MissionDialog from '@/components/admin/MissionDialog';
import MissionDeleteDialog from '@/components/admin/MissionDeleteDialog';
import QRDialog from '@/components/admin/QRDialog';
import { Mission } from '@/types/mission';
import {
  useDeleteAdminMissionMutation,
  useUpdateAdminMissionMutation,
} from '@/features/admin/missions/adminMissionMutations';
import { useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

type Props = {
  missions: AdminMissionDetail[];
};

export default function MissionList({ missions }: Props) {
  const [editingMission, setEditingMission] =
    useState<AdminMissionDetail | null>(null);
  const [deletingMission, setDeletingMission] = useState<Mission | null>(null);
  const [viewingQR, setViewingQR] = useState<{
    title: string;
    token: string;
    id: number;
  } | null>(null);
  const { mutate: deleteAdminMission } = useDeleteAdminMissionMutation();
  const { mutate: updateAdminMission } = useUpdateAdminMissionMutation();
  const eventId = Number(useParams().eventId);
  const queryClient = useQueryClient();

  const invalidateMissions = () => {
    queryClient.invalidateQueries({
      queryKey: ['admin', 'events', eventId, 'missions'],
    });
  };

  const handlerDelete = (missionId: number) => {
    setDeletingMission(null);
    deleteAdminMission(
      { eventId, missionId },
      { onSuccess: invalidateMissions }
    );
  };

  const handlerToggleActive = (missionId: number, checked: boolean) => {
    updateAdminMission(
      { eventId, missionId, payload: { isActive: checked } },
      { onSuccess: invalidateMissions }
    );
  };

  const handlerSave = (mission: Mission) => {
    if (!mission.id) return;
    setEditingMission(null);
    updateAdminMission(
      {
        eventId,
        missionId: mission.id,
        payload: { title: mission.title, description: mission.description },
      },
      { onSuccess: invalidateMissions }
    );
  };

  if (missions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gomin-neutral-400">
        <p className="text-sm">미션을 추가해주세요.</p>
      </div>
    );
  }

  return (
    <>
      {missions.map((mission, index) => (
        <div
          key={mission.id}
          className="grid items-center px-6 py-5 border-b border-gomin-neutral-100 last:border-b-0 hover:bg-gomin-neutral-100/30"
          style={{ gridTemplateColumns: '40px 60px 1fr 2fr 110px 72px 90px' }}
        >
          <div className="cursor-grab text-gomin-neutral-300">
            <GripVertical className="w-4 h-4" />
          </div>
          <div className="text-sm text-gomin-neutral-600 ">{index + 1}</div>

          <div className="text-sm font-medium text-gomin-black">
            {mission.title}
          </div>
          <div className="text-sm text-gomin-neutral-500">
            {mission.description}
          </div>

          <div className="flex justify-center">
            <Switch
              defaultChecked={mission.isActive}
              className="data-checked:bg-gomin-primary-600"
              onCheckedChange={(checked) =>
                handlerToggleActive(mission.id, checked)
              }
            />
          </div>

          <div className="flex justify-center">
            {mission.qrCodes?.map((qrCode: { id: number; token: string }) => (
              <Button
                key={qrCode.id}
                variant="outline"
                size="icon-sm"
                onClick={() =>
                  setViewingQR({
                    title: mission.title,
                    token: qrCode.token,
                    id: qrCode.id,
                  })
                }
              >
                <QrCode />
              </Button>
            ))}
          </div>

          <div className="flex justify-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setEditingMission(mission)}
            >
              <Pencil />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              className="hover:text-destructive"
              onClick={() => setDeletingMission(mission)}
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      ))}

      <Dialog
        open={editingMission !== null}
        onOpenChange={(open) => !open && setEditingMission(null)}
      >
        {editingMission && (
          <MissionDialog mission={editingMission} onSave={handlerSave} />
        )}
      </Dialog>

      <Dialog
        open={deletingMission !== null}
        onOpenChange={(open) => !open && setDeletingMission(null)}
      >
        {deletingMission && (
          <MissionDeleteDialog
            key={deletingMission.id}
            mission={deletingMission}
            onDelete={handlerDelete}
          />
        )}
      </Dialog>

      <Dialog
        open={viewingQR !== null}
        onOpenChange={(open) => !open && setViewingQR(null)}
      >
        {viewingQR && (
          <QRDialog
            missionTitle={viewingQR.title}
            token={viewingQR.token}
            qrId={viewingQR.id}
          />
        )}
      </Dialog>
    </>
  );
}
