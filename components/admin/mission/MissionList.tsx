"use client";

import { useMemo, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import type { AdminMissionDetail } from "@/types/models";
import MissionItem from "@/components/admin/mission/MissionItem";
import MissionDialog from "@/components/admin/mission/MissionDialog";
import MissionDeleteDialog from "@/components/admin/mission/MissionDeleteDialog";
import QRDialog from "@/components/admin/common/qr/QRDialog";
import { getMissionCheckUrl } from "@/utils/qr";
import { Mission } from "@/types";
import {
  useDeleteAdminMissionMutation,
  useReorderAdminMissionsMutation,
  useUpdateAdminMissionMutation,
} from "@/features/admin/missions/adminMissionMutations";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

type Props = {
  missions: AdminMissionDetail[];
  disabled?: boolean;
};

export default function MissionList({ missions, disabled = false }: Props) {
  const sortedMissions = useMemo(
    () => [...missions].sort((a, b) => a.sortOrder - b.sortOrder),
    [missions]
  );

  const [editingMission, setEditingMission] =
    useState<AdminMissionDetail | null>(null);
  const [deletingMission, setDeletingMission] = useState<Mission | null>(null);
  const [viewingQR, setViewingQR] = useState<{
    title: string;
    description: string;
    token: string;
    id: number;
  } | null>(null);

  const { mutateAsync: deleteAdminMissionAsync } =
    useDeleteAdminMissionMutation();
  const { mutateAsync: updateAdminMissionAsync } =
    useUpdateAdminMissionMutation();
  const { mutateAsync: reorderAdminMissionsAsync } =
    useReorderAdminMissionsMutation();
  const eventId = Number(useParams().eventId);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Switch, Button 클릭과 드래그 충돌 방지
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const oldIndex = sortedMissions.findIndex((m) => m.id === active.id);
    const newIndex = sortedMissions.findIndex((m) => m.id === over.id);
    const reordered = arrayMove(sortedMissions, oldIndex, newIndex);
    try {
      await reorderAdminMissionsAsync({
        eventId,
        missionIds: reordered.map((m) => m.id),
      });
    } catch (e) {
      console.error(e);
      toast.error("미션 순서 변경에 실패했습니다.");
    }
  };

  const handleDelete = async (missionId: number) => {
    try {
      await deleteAdminMissionAsync({ eventId, missionId });
    } catch (e) {
      console.error(e);
      toast.error("미션 삭제에 실패했습니다.");
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
    } catch (e) {
      console.error(e);
      toast.error("미션 상태 변경에 실패했습니다.");
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
    } catch (e) {
      console.error(e);
      toast.error("미션 수정에 실패했습니다.");
    } finally {
      setEditingMission(null);
    }
  };

  if (sortedMissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gomin-neutral-400">
        <p className="text-sm">미션을 추가해주세요.</p>
      </div>
    );
  }

  return (
    <>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext
          items={sortedMissions.map((m) => m.id)}
          strategy={verticalListSortingStrategy}
        >
          {sortedMissions.map((mission, index) => (
            <MissionItem
              key={mission.id}
              mission={mission}
              index={index}
              disabled={disabled}
              onToggleActive={handleToggleActive}
              onViewQR={setViewingQR}
              onEdit={setEditingMission}
              onDelete={setDeletingMission}
            />
          ))}
        </SortableContext>
      </DndContext>

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
            title={viewingQR.title}
            url={getMissionCheckUrl(viewingQR.token)}
            filename={`${viewingQR.title}_${viewingQR.id}.png`}
            description={viewingQR.description}
          />
        )}
      </Dialog>
    </>
  );
}
