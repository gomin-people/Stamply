"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import type { AdminMissionDetail } from "@/types/models/admin";
import MissionItem from "@/components/admin/mission/MissionItem";
import MissionDialog from "@/components/admin/mission/MissionDialog";
import MissionDeleteDialog from "@/components/admin/mission/MissionDeleteDialog";
import QRDialog from "@/components/admin/mission/QRDialog";
import { Mission } from "@/types";
import {
  useDeleteAdminMissionMutation,
  useUpdateAdminMissionMutation,
} from "@/features/admin/missions/adminMissionMutations";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

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
  const { mutateAsync: deleteAdminMissionAsync } =
    useDeleteAdminMissionMutation();
  const { mutateAsync: updateAdminMissionAsync } =
    useUpdateAdminMissionMutation();
  const eventId = Number(useParams().eventId);
  const queryClient = useQueryClient();

  const invalidateMissions = () => {
    queryClient.invalidateQueries({
      queryKey: ["admin", "events", eventId, "missions"],
    });
  };

  const handleDelete = async (missionId: number) => {
    try {
      await deleteAdminMissionAsync({ eventId, missionId });
      invalidateMissions();
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingMission(null);
    }
  };

  const handleToggleActive = async (missionId: number, checked: boolean) => {
    try {
      await updateAdminMissionAsync({
        eventId,
        missionId,
        payload: { isActive: checked },
      });
      invalidateMissions();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (mission: Mission) => {
    if (!mission.id) return;
    try {
      await updateAdminMissionAsync({
        eventId,
        missionId: mission.id,
        payload: { title: mission.title, description: mission.description },
      });
      invalidateMissions();
    } catch (e) {
      console.error(e);
    } finally {
      setEditingMission(null);
    }
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
        <MissionItem
          key={mission.id}
          mission={mission}
          index={index}
          onToggleActive={handleToggleActive}
          onViewQR={setViewingQR}
          onEdit={setEditingMission}
          onDelete={setDeletingMission}
        />
      ))}

      <Dialog
        open={editingMission !== null}
        onOpenChange={(open) => !open && setEditingMission(null)}
      >
        {editingMission && (
          <MissionDialog mission={editingMission} onSave={handleSave} />
        )}
      </Dialog>

      <Dialog
        open={deletingMission !== null}
        onOpenChange={(open) => !open && setDeletingMission(null)}
      >
        {deletingMission && (
          <MissionDeleteDialog
            mission={deletingMission}
            onDelete={handleDelete}
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
