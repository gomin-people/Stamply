import type { ParticipantMissions } from "@/features/participant/missions/participantMissionQueries";

type InitialMission = {
  id: number;
  title: string;
  description: string | null;
  isCompleted: boolean;
};

export function buildInitialData(
  initialMissions: InitialMission[]
): ParticipantMissions {
  return {
    participant: {} as ParticipantMissions["participant"],
    missions: initialMissions.map((m) => ({
      id: m.id,
      eventsId: 0,
      title: m.title,
      description: m.description,
      sortOrder: 0,
      isActive: true,
      createdAt: "",
      updatedAt: "",
      isCompleted: m.isCompleted,
      completedAt: null,
      token: null,
    })),
    summary: {
      totalCount: initialMissions.length,
      completedCount: initialMissions.filter((m) => m.isCompleted).length,
    },
  };
}
