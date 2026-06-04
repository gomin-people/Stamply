import { create } from "zustand";
import { combine, persist } from "zustand/middleware";

export const adminStore = create(
  persist(
    combine(
      {
        selectedEventId: null as string | null,
        isEditMode: false,
        pendingHref: null as string | null,
      },
      (set) => ({
        setSelectedEventId: (id: string) => set({ selectedEventId: id }),
        clearSelectedEventId: () => set({ selectedEventId: null }),
        setIsEditMode: (value: boolean) => set({ isEditMode: value }),
        setPendingHref: (href: string | null) => set({ pendingHref: href }),
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

export const useClearSelectedEventId = () =>
  adminStore((store) => store.clearSelectedEventId);

export const useIsEditMode = () => adminStore((store) => store.isEditMode);
export const useSetIsEditMode = () =>
  adminStore((store) => store.setIsEditMode);
export const usePendingHref = () => adminStore((store) => store.pendingHref);
export const useSetPendingHref = () =>
  adminStore((store) => store.setPendingHref);
