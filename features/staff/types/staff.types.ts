import type { PermissionId, Position } from "../constant/staff.constant";

export interface CreateStaffPayload {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  position: Position;
  employeeId?: string;
  startDate: string;
  permissions: PermissionId[];
  password: string;
  mustChangePassword: boolean;
}

export interface StaffSummary {
  id: string;
  userId: string;
  email: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  position: Position;
  employeeId?: string;
  startDate: string;
  permissions: PermissionId[];
  mustChangePassword: boolean;
  active: boolean;
  createdAt: string;
}

export interface SetStaffActivePayload {
  active: boolean;
}