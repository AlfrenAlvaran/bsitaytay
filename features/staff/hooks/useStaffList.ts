import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { staffApi } from "../api/staff.api";

export const STAFF_LIST_KEY = ["admin", "staff"] as const;

export function useStaffList() {
  return useQuery({
    queryKey: STAFF_LIST_KEY,
    queryFn: async () => (await staffApi.list()).staff,
  });
}

export function useSetStaffActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      staffApi.setActive(id, active),
    onSuccess: () => qc.invalidateQueries({ queryKey: STAFF_LIST_KEY }),
  });
}