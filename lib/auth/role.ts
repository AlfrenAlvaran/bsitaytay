export const ROLES = ["RESIDENT", "STAFF", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];
