export const GENDERS = ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"] as const;

export const CIVIL_STATUSES = [
  "SINGLE",
  "MARRIED",
  "WIDOWED",
  "SEPARATED",
  "DIVORCED",
] as const;

export const GENDER_LABELS: Record<(typeof GENDERS)[number], string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
  PREFER_NOT_TO_SAY: "Prefer not to say",
};

export const CIVIL_STATUS_LABELS: Record<
  (typeof CIVIL_STATUSES)[number],
  string
> = {
  SINGLE: "Single",
  MARRIED: "Married",
  WIDOWED: "Widowed",
  SEPARATED: "Separated",
  DIVORCED: "Divorced",
};


export function computeAge(dob?: string | Date | null): number | null {
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age >= 0 ? age : null;
}