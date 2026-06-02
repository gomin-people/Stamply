export interface Mission {
  id?: number;
  title: string;
  description: string | null;
  isActive: boolean;
}

export interface StepFormHandle {
  validate: () => boolean;
  getData: () => Record<string, unknown>;
}
