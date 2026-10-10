"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";

export const CURRENT_USER_KEY = ["auth", "me"] as const;

const hasSessionHint = () =>
  document.cookie.split("; ").some((c) => c.startsWith("logged_in="));

export function useCurrentUser() {
  const [hint, setHint] = useState<boolean | null>(null); // null = not checked yet

  useEffect(() => {
    setHint(hasSessionHint());
  }, []);

  const query = useQuery({
    queryKey: CURRENT_USER_KEY,
    queryFn: authApi.me,
    enabled: hint === true,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    ...query,
    // avoid a "Sign In" flash before the cookie check runs
    isLoading: hint === null || query.isLoading,
  };
}