'use client';

import { useState } from 'react';
import { GripVertical, QrCode, Pencil, Trash2 } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import type { Mission } from '@/types/mission';
import MissionDialog from './MissionDialog';
import MissionDeleteDialog from './MissionDeleteDialog';

type Props = {
  missions: (Mission & { active: boolean })[];
};

export default function MissionList({ missions }: Props) {
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  return (
    <>
      {missions.map((mission) => (
        <div
          key={mission.id}
          className="grid items-center px-6 py-5 border-b border-gomin-neutral-100 last:border-b-0 hover:bg-gomin-neutral-100/30"
          style={{ gridTemplateColumns: '40px 60px 1fr 2fr 110px 72px 90px' }}
        >
          <div className="cursor-grab text-gomin-neutral-300">
            <GripVertical className="w-4 h-4" />
          </div>
          <div className="text-sm text-gomin-neutral-600 ">{mission.id}</div>
          <div className="text-sm font-medium text-gomin-black">
            {mission.name}
          </div>
          <div className="text-sm text-gomin-neutral-500">
            {mission.description}
          </div>

          <div className="flex justify-center">
            <Switch
              defaultChecked={mission.active}
              className="data-checked:bg-gomin-primary-600"
            />
          </div>

          <div className="flex justify-center">
            <Button variant="outline" size="icon-sm">
              <QrCode />
            </Button>
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
              onClick={() => mission.id && setDeletingId(mission.id)}
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
        {editingMission && <MissionDialog mission={editingMission} />}
      </Dialog>

      <Dialog
        open={deletingId !== null}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        {deletingId !== null && <MissionDeleteDialog id={deletingId} />}
      </Dialog>

      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <MissionDialog mission={{ name: '', description: '' }} />
      </Dialog>

      <div className="p-4">
        <Button
          variant="outline"
          className="w-full border-dashed border-gomin-primary-300 text-gomin-primary-600 hover:bg-gomin-primary-100 hover:text-gomin-primary-600"
          onClick={() => setIsAdding(true)}
        >
          + 미션 추가
        </Button>
      </div>
    </>
  );
}
