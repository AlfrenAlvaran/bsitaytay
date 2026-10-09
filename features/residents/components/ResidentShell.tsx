"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  FilePlus2,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Megaphone,
  Menu,
  Phone,
  User,
  X,
  type LucideIcon,
} from "lucide-react";

import { authApi } from "@/features/auth/api/auth.api";
import {
  CURRENT_USER_KEY,
  useCurrentUser,
} from "@/features/auth/hooks/useCurrentUser";
import Image from "next/image";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
};

const NAV: { group?: string; items: NavItem[] }[] = [
  {
    items: [
      { label: "Dashboard", href: "/resident", icon: LayoutDashboard },
      { label: "Request document", href: "/resident/request", icon: FilePlus2 },
      {
        label: "My requests",
        href: "/resident/requests",
        icon: ListChecks,
        badge: 2,
      },
    ],
  },
  // {
  //   group: "Community",
  //   items: [
  //     {
  //       label: "Announcements",
  //       href: "/resident/announcements",
  //       icon: Megaphone,
  //     },
  //     { label: "Contact barangay", href: "/resident/contact", icon: Phone },
  //   ],
  // },
  {
    group: "Account",
    items: [{ label: "My profile", href: "/resident/profile", icon: User }],
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

export function ResidentShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: user, isLoading, isError } = useCurrentUser();

  const name = user ? `${user.firstName} ${user.lastName}` : "";

  const initials = getInitials(name);

  // Close the drawer after navigating
  useEffect(() => setOpen(false), [pathname]);

  // Redirect when there is no valid session
  useEffect(() => {
    if (!isLoading && (isError || !user)) router.replace("/login");
  }, [isLoading, isError, user, router]);

  const signOut = async () => {
    try {
      await authApi.logout();
    } finally {
      qc.removeQueries({ queryKey: CURRENT_USER_KEY });
      router.replace("/login");
      router.refresh();
    }
  };

  const isActive = (href: string) =>
    href === "/resident" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[260px_1fr]">
      {/* Scrim (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        aria-label="Resident navigation"
        className={`fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col gap-5 overflow-y-auto bg-slate-900 p-4 text-slate-300 transition-transform lg:sticky lg:top-0 lg:h-screen lg:w-auto lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-2 pt-1">
          <div className="grid size-10 place-items-center rounded-full bg-amber-500 text-sm font-extrabold text-slate-900">
            <Image
              src={"/barangay-logo.svg"}
              alt="logo"
              width={100}
              height={10}
              className="rounded-full"
            />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white">Brgy. San Isidro</p>
            <p className="text-xs text-slate-400">Taytay, Rizal</p>
          </div>
          <button
            className="ml-auto rounded-md p-1 text-slate-400 hover:bg-white/10 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex flex-col">
          {NAV.map((section, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              {section.group && (
                <p className="px-2.5 pb-1.5 pt-4 text-xs font-semibold text-slate-500">
                  {section.group}
                </p>
              )}
              {section.items.map(({ label, href, icon: Icon, badge }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-amber-500/15 text-white shadow-[inset_3px_0_0_theme(colors.amber.500)]"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <Icon className="size-[18px]" />
                    {label}
                    {/* {badge ? (
                      <span className="ml-auto rounded-full bg-amber-500 px-2 text-xs font-bold text-slate-900">
                        {badge}
                      </span>
                    ) : null} */}
                  </Link>
                );
              })}
            </div>
          ))}

          {/* Sign out is an action, not a page, so it's a button */}
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={signOut}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors hover:bg-white/5"
            >
              <LogOut className="size-[18px]" />
              Sign out
            </button>
          </div>
        </nav>

        <div className="mt-auto rounded-xl border border-slate-800 p-3 text-[13px] text-slate-400">
          <p className="font-semibold text-white">Office hours</p>
          Monday to Friday, 8:00 AM to 5:00 PM at the Barangay Hall.
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-7">
          <button
            className="rounded-lg border border-slate-200 p-2 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-[18px]" />
          </button>
          <p className="font-semibold text-slate-900">Resident portal</p>

          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/resident/request"
              className="hidden items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white hover:bg-slate-800 sm:inline-flex"
            >
              <FilePlus2 className="size-4" />
              Request document
            </Link>

            {isLoading ? (
              <div className="flex items-center gap-2.5 pl-1" aria-busy>
                <div className="size-9 animate-pulse rounded-full bg-slate-200" />
                <div className="hidden space-y-1.5 sm:block">
                  <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-14 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 pl-1">
                <div className="relative size-9 overflow-hidden rounded-full border border-amber-500 bg-amber-50 text-xs font-bold text-amber-600">
                  {user?.profileImageUrl ? (
                    <Image
                      src={user.profileImageUrl}
                      alt={name}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="grid size-full place-items-center">
                      {initials}
                    </span>
                  )}
                </div>
                <div className="hidden text-[13px] leading-tight sm:block">
                  <p className="font-semibold text-slate-900">{name}</p>
                  <p className="text-slate-500">Resident</p>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
