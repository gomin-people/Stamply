type OperationStatus = "before" | "during" | "after";

export function getEventOperationStatus(
  startDate: string,
  endDate: string
): OperationStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (today < start) return "before";
  if (today > end) return "after";
  return "during";
}

export function useEventOperationStatus(
  startDate?: string,
  endDate?: string
): OperationStatus | null {
  if (!startDate || !endDate) return null;
  return getEventOperationStatus(startDate, endDate);
}
