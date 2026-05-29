import { create } from "zustand";
import { combine, persist } from "zustand/middleware";

export const adminStore = create(
  persist(
    combine(
      {
        selectedEventId: null as string | null,
      },
      (set) => ({
        setSelectedEventId: (id: string) => set({ selectedEventId: id }),
      })
    ),
    {
      name: "admin-store",
      partialize: (state) => ({
        selectedEventId: state.selectedEventId,
      }),
    }
  )
);

export const useSelectedEventId = () =>
  adminStore((store) => store.selectedEventId);

export const useSetSelectedEventId = () =>
  adminStore((store) => store.setSelectedEventId);
