export const POSITIONS = [
  "Barangay Secretary",
  "Barangay Treasurer",
  "Records Clerk",
  "Front Desk",
  "Health Worker",
  "Other",
] as const;

export const PERMISSIONS = [
  { id: "process", label: "Process requests", desc: "Review, approve or reject requests" },
  { id: "release", label: "Release documents", desc: "Mark documents as released" },
  { id: "fees", label: "Collect fees", desc: "Record payments at pickup" },
  { id: "residents", label: "Manage residents", desc: "Verify and edit resident records" },
  { id: "announce", label: "Publish announcements", desc: "Post news and notices" },
] as const;

export const PERMISSION_IDS = [
  "process",
  "release",
  "fees",
  "residents",
  "announce",
] as const;

export type Position = (typeof POSITIONS)[number];
export type PermissionId = (typeof PERMISSION_IDS)[number];

export const PRESETS: Record<string, PermissionId[]> = {
  "Front desk": ["process", "release"],
  Clerk: ["process", "release", "residents"],
  Treasurer: ["fees", "release"],
  "Full access": [...PERMISSION_IDS],
};