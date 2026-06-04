export type EventOperationStatus = "before" | "during" | "after";

const getLocalDateKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDateKey = (value: string) => value.slice(0, 10);

export function getEventOperationStatus(
  startDate: string,
  endDate: string
): EventOperationStatus {
  const today = getLocalDateKey();
  const start = getDateKey(startDate);
  const end = getDateKey(endDate);

  if (today < start) return "before";
  if (today > end) return "after";
  return "during";
}
