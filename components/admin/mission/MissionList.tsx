"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import type { AdminMissionDetail } from "@/types/models/admin";
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
import { useQueryClient } from "@tanstack/react-query";
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
  isFetching?: boolean;
  onReorderingChange?: (isReordering: boolean) => void;
};

export default function MissionList({
  missions,
  isFetching,
  onReorderingChange,
}: Props) {
  const [prevMissions, setPrevMissions] = useState(missions);
  const [items, setItems] = useState<AdminMissionDetail[]>(() =>
    [...missions].sort((a, b) => a.sortOrder - b.sortOrder)
  );

  // missions prop이 바뀌면 렌더 중 동기 업데이트 (useEffect 대신 권장 패턴)
  if (prevMissions !== missions) {
    setPrevMissions(missions);
    setItems([...missions].sort((a, b) => a.sortOrder - b.sortOrder));
  }
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
  const { mutateAsync: reorderAdminMissionsAsync, isPending: isReordering } =
    useReorderAdminMissionsMutation();
  const eventId = Number(useParams().eventId);
  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Switch, Button 클릭과 드래그 충돌 방지
      activationConstraint: { distance: 8 },
    })
  );

  const invalidateMissions = () => {
    queryClient.invalidateQueries({
      queryKey: ["admin", "events", eventId, "missions"],
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((m) => m.id === active.id);
    const newIndex = items.findIndex((m) => m.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);

    setItems(reordered); // 낙관적 업데이트
    onReorderingChange?.(true);
    try {
      await reorderAdminMissionsAsync({
        eventId,
        missionIds: reordered.map((m) => m.id),
      });
      invalidateMissions();
    } catch (e) {
      console.error(e);
      setItems(items); // 실패 시 롤백
    } finally {
      onReorderingChange?.(false);
    }
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

  if (items.length === 0) {
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
          items={items.map((m) => m.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((mission, index) => (
            <MissionItem
              key={mission.id}
              mission={mission}
              index={index}
              disabled={isReordering || isFetching}
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
