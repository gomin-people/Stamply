"use client";

import { GripVertical, Pencil, Trash2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { AdminMissionDetail } from "@/types/models/admin";
import type { Mission } from "@/types";

type Props = {
  mission: AdminMissionDetail;
  index: number;
  onToggleActive: (missionId: number, checked: boolean) => void;
  onViewQR: (info: { title: string; token: string; id: number }) => void;
  onEdit: (mission: AdminMissionDetail) => void;
  onDelete: (mission: Mission) => void;
};

export default function MissionItem({
  mission,
  index,
  onToggleActive,
  onViewQR,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div
      className="grid items-center px-6 py-5 border-b border-gomin-neutral-100 last:border-b-0 hover:bg-gomin-neutral-100/30"
      style={{ gridTemplateColumns: "40px 60px 1fr 2fr 110px 72px 90px" }}
    >
      <div className="cursor-grab text-gomin-neutral-300">
        <GripVertical className="w-4 h-4" />
      </div>
      <div className="text-sm text-gomin-neutral-600">{index + 1}</div>

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
          onCheckedChange={(checked) => onToggleActive(mission.id, checked)}
        />
      </div>

      <div className="flex justify-center">
        {mission.qrCodes?.map((qrCode: { id: number; token: string }) => (
          <Button
            key={qrCode.id}
            variant="outline"
            size="icon-sm"
            onClick={() =>
              onViewQR({
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
          onClick={() => onEdit(mission)}
        >
          <Pencil />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          className="hover:text-destructive"
          onClick={() => onDelete(mission)}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}
