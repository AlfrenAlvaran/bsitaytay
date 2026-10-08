"use client";

import { useCurrentUser } from "./useCurrentUser";

export function useAuthDisplay() {
  const { data: user, isLoading } = useCurrentUser();

  const isAuthenticated = !!user;

  const isResident = user?.role === "RESIDENT";

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  const userName = fullName || user?.email || "";
  const userEmail = user?.email || "";

  const initials =
    (user?.firstName?.[0] ?? "") + user?.lastName?.[0] ||
    (user?.email?.[0] ?? "");

  const dashboardLabel = isResident ? "My Portal" : "Dashboard";

  return {
    user,
    isLoading,
    isAuthenticated,
    isResident,
    userName,
    userEmail,
    initials: initials.toUpperCase(),
    dashboardLabel,
  };
}
