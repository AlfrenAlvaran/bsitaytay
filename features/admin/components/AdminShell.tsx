"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  FileStack,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
};

const NAV: { group?: string; items: NavItem[] }[] = [
  {
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      {
        label: "Document requests",
        href: "/admin/requests",
        icon: FileStack,
        badge: 12,
      },
      { label: "Residents", href: "/admin/residents", icon: Users },
    ],
  },
  {
    group: "Content",
    items: [
      { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
      { label: "Reports", href: "/admin/reports", icon: BarChart3 },
    ],
  },
  {
    group: "System",
    items: [
      { label: "Staff and roles", href: "/admin/staff", icon: ShieldCheck },
      { label: "Settings", href: "/admin/settings", icon: Settings },
      { label: "logout", href: "/logout", icon: LogOut },
    ],
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[264px_1fr]">
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <aside
        aria-label="Admin navigation"
        className={`fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col gap-5 overflow-y-auto bg-slate-950 p-4 text-slate-300 transition-transform lg:sticky lg:top-0 lg:h-screen lg:w-auto lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-2 pt-1">
          <div className="grid size-10 place-items-center rounded-full bg-amber-500 text-sm font-extrabold text-slate-900">
            SI
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white">Brgy. San Isidro</p>
            <p className="mt-0.5 inline-block rounded bg-amber-500/15 px-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Admin
            </p>
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
                    {badge ? (
                      <span className="ml-auto rounded-full bg-amber-500 px-2 text-xs font-bold text-slate-900">
                        {badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <Link
          href="/"
          className="mt-auto rounded-xl border border-slate-800 p-3 text-[13px] text-slate-400 hover:border-slate-700"
        >
          <span className="font-semibold text-white">View public site</span>
          <br />
          Open the resident-facing website.
        </Link>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-7">
          <button
            className="rounded-lg border border-slate-200 p-2 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-[18px]" />
          </button>

          <label className="relative hidden max-w-sm flex-1 sm:block">
            <span className="sr-only">Search</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search residents or reference no."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30"
            />
          </label>

          <div className="ml-auto flex items-center gap-3">
            <button
              className="relative rounded-xl border border-slate-200 p-2"
              aria-label="Notifications"
            >
              <Bell className="size-4.5" />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full border-2 border-white bg-amber-500" />
            </button>
            <div className="flex items-center gap-2.5 pl-1">
              <div className="grid size-9 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white">
                {/* {admin.initials} */}
              </div>
              <div className="hidden text-[13px] leading-tight sm:block">
                <p className="font-semibold text-slate-900"></p>
                <p className="text-slate-500"></p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
