export function safeRedirect(
  next?: string | null,
  fallback = "/dashboard",
): string {
  if (!next) return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return fallback;
  }

  const inArea = next === fallback || next.startsWith(`${fallback}/`);
  return inArea ? next : fallback;
}