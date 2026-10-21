import { secretEnv } from "@/lib/config/env";
import React from "react";

export const isProduction = secretEnv.NODE_ENV;

// Children

export type PropsChildren = {
  children: React.ReactNode;
};
