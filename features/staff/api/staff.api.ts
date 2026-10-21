import { http } from "@/lib/http/client";
import type { CreateStaffPayload, StaffSummary } from "../types/staff.types";

export const staffApi = {
  create: (payload: CreateStaffPayload) =>
    http.post<{ staff: { id: string; email: string } }>(
      "/admin/staff",
      payload,
    ),
  list: () => http.get<{ staff: StaffSummary[] }>("/admin/staff"),
  setActive: (id: string, active: boolean) =>
    http.patch<{ ok: true }>(`/admin/staff/${id}`, { active }),
};