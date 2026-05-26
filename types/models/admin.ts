export interface AdminUserModel {
  id: string;
  name: string;
}

export interface QrCodeModel {
  id: number;
  token: string;
}

export interface MissionModel {
  id: number;
  eventId: number;
  title: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminMissionDetail extends MissionModel {
  qrCodes: QrCodeModel[] | null;
}
