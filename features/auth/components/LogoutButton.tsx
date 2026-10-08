"use client";

import { forwardRef } from "react";
import { LogOut, LoaderCircle, type LucideIcon } from "lucide-react";
import { useLogout } from "../hooks/useLogout";

type Variant = "sidebar" | "solid" | "outline" | "soft" | "ghost";
type Size = "sm" | "md" | "lg";

type Props = {
  className?: string;
  onDone?: () => void;
  variant?: Variant;
  size?: Size;
  label?: string;
  loadingLabel?: string;
  icon?: LucideIcon;
  showIcon?: boolean;
  iconOnly?: boolean;
  fullWidth?: boolean;
};

const base =
  "group inline-flex select-none items-center justify-center gap-2.5 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  sidebar:
    "h-11 w-full justify-start gap-3 border border-white/10 bg-white/[0.03] px-2.5 text-sm text-slate-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300 focus-visible:ring-red-500 focus-visible:ring-offset-[#020617]",
  solid:
    "bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950",
  outline:
    "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus-visible:ring-red-500 focus-visible:ring-offset-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400 dark:focus-visible:ring-offset-slate-950",
  soft: "bg-red-50 text-red-600 hover:bg-red-100 focus-visible:ring-red-500 focus-visible:ring-offset-white dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/70 dark:focus-visible:ring-offset-slate-950",
  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-red-600 focus-visible:ring-red-500 focus-visible:ring-offset-white dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-red-400 dark:focus-visible:ring-offset-slate-950",
};

const sizes: Record<Size, { text: string; icon: string; iconOnly: string }> = {
  sm: { text: "h-8 px-3 text-xs", icon: "h-3.5 w-3.5", iconOnly: "h-8 w-8" },
  md: { text: "h-10 px-3.5 text-sm", icon: "h-4 w-4", iconOnly: "h-10 w-10" },
  lg: { text: "h-12 px-5 text-base", icon: "h-5 w-5", iconOnly: "h-12 w-12" },
};

export const LogoutButton = forwardRef<HTMLButtonElement, Props>(
  function LogoutButton(
    {
      className = "",
      onDone,
      variant = "outline",
      size = "md",
      label = "Log out",
      loadingLabel = "Logging out...",
      icon: Icon = LogOut,
      showIcon = true,
      iconOnly = false,
      fullWidth = false,
    },
    ref,
  ) {
    const { mutate, isPending } = useLogout();
    const s = sizes[size];
    const isSidebar = variant === "sidebar";
    const iconSize = isSidebar ? "h-4 w-4" : s.icon;

    const classes = [
      base,
      variants[variant],
      !isSidebar && (iconOnly ? `${s.iconOnly} shrink-0 p-0` : s.text),
      !isSidebar && fullWidth && !iconOnly ? "w-full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const icon = isPending ? (
      <LoaderCircle
        className={`${iconSize} shrink-0 animate-spin`}
        aria-hidden="true"
      />
    ) : (
      <Icon className={`${iconSize} shrink-0`} aria-hidden="true" />
    );

    return (
      <button
        ref={ref}
        type="button"
        disabled={isPending}
        aria-busy={isPending}
        aria-label={iconOnly ? (isPending ? loadingLabel : label) : undefined}
        title={iconOnly ? label : undefined}
        onClick={() => {
          onDone?.();
          mutate();
        }}
        className={classes}
      >
        {isSidebar ? (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/5 text-slate-400 transition-colors group-hover:bg-red-500/15 group-hover:text-red-400">
            {icon}
          </span>
        ) : (
          (showIcon || iconOnly) && icon
        )}

        {!iconOnly && <span>{isPending ? loadingLabel : label}</span>}
      </button>
    );
  },
);
