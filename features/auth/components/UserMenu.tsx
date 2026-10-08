"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { LogoutButton } from "./LogoutButton";

type Props = {
  initials: string;
  userName: string | null;
  userEmail: string | null;
  dashboardLabel: string;
};

const menuItem =
  "flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:pl-5 transition-all duration-200 ease-out";

const UserMenu = ({ initials, userName, userEmail, dashboardLabel }: Props) => {
  const [open, setOpen] = useState(false);

  const menuRef = useClickOutside<HTMLDivElement>(() => setOpen(false));

  return (
    <div className="relative ml-1" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.97] transition-all duration-200 ease-out"
      >
        <span className="w-7 h-7 rounded-full bg-[#0F172A] text-white text-[11px] font-semibold flex items-center justify-center">
          {initials}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ease-out ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        role="menu"
        className={`absolute top-full right-0 mt-1 w-56 bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-900/10 z-50 py-1.5 overflow-hidden transition-all duration-200 ease-out origin-top-right ${
          open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
        }`}
      >
        <div className="px-4 py-2.5 border-b border-slate-100">
          <p className="text-[13px] font-semibold text-slate-900 truncate">
            {userName || "Resident"}
          </p>
          <p className="text-[12px] text-slate-400 truncate">{userEmail}</p>
        </div>

        <Link
          href="/dashboard"
          onClick={() => setOpen(false)}
          className={menuItem}
        >
          {dashboardLabel}
        </Link>
        <Link
          href="/profile"
          onClick={() => setOpen(false)}
          className={menuItem}
        >
          Profile Settings
        </Link>

        <div className="h-px bg-slate-100 my-1" />

        <LogoutButton />
      </div>
    </div>
  );
};

export default UserMenu;
