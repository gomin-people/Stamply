"use client";

import { GripVertical, Pencil, Trash2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { AdminMissionDetail } from "@/types/models";
import type { Mission } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  mission: AdminMissionDetail;
  index: number;
  disabled?: boolean;
  onToggleActive: (missionId: number, checked: boolean) => void;
  onViewQR: (info: {
    title: string;
    description: string;
    token: string;
    id: number;
  }) => void;
  onEdit: (mission: AdminMissionDetail) => void;
  onDelete: (mission: Mission) => void;
};

export default function MissionItem({
  mission,
  index,
  disabled = false,
  onToggleActive,
  onViewQR,
  onEdit,
  onDelete,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id: mission.id, disabled });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      suppressHydrationWarning
      style={{
        gridTemplateColumns: "40px 60px 1fr 2fr 110px 72px 90px",
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`grid items-center px-6 py-5 border-b border-gomin-neutral-100 last:border-b-0 hover:bg-gomin-neutral-100/30 transition-opacity ${disabled ? "opacity-40 pointer-events-none" : ""}`}
    >
      <div
        ref={setActivatorNodeRef}
        {...listeners}
        className="cursor-grab text-gomin-neutral-300 select-none"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      <div className="text-sm text-gomin-neutral-600">{index + 1}</div>

      <div className="text-sm font-medium text-gomin-black truncate">
        {mission.title}
      </div>
      <div className="text-sm text-gomin-neutral-500 truncate">
        {mission.description}
      </div>

      <div className="flex justify-center">
        <Switch
          defaultChecked={mission.isActive}
          className="data-checked:bg-gomin-primary-600"
          disabled={disabled}
          onCheckedChange={(checked) => onToggleActive(mission.id, checked)}
        />
      </div>

      <div className="flex justify-center">
        {mission.qrCodes?.map((qrCode: { id: number; token: string }) => (
          <Button
            key={qrCode.id}
            variant="outline"
            size="icon-sm"
            disabled={disabled}
            onClick={() =>
              onViewQR({
                title: mission.title,
                description: mission.description ?? "",
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
          disabled={disabled}
          onClick={() => onEdit(mission)}
        >
          <Pencil />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          className="hover:text-destructive"
          disabled={disabled}
          onClick={() => onDelete(mission)}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}
