"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { useAuthDisplay } from "@/features/auth/hooks/useAuthDisplay";
import { LogoutButton } from "@/features/auth/components/LogoutButton";

import { isLinkActive } from "./nav.utils";
import MobileLinkItem from "./MobileLinkItem";
import { NAV_LINKS } from "./nav-links";

type Props = {
  open: boolean;
  onClose: () => void;
};

const MobileMenu = ({ open, onClose }: Props) => {
  const pathname = usePathname();
  const [expandedLink, setExpandedLink] = useState<string | null>(null);
  const {
    isAuthenticated,
    isLoading,
    isResident,
    dashboardLabel,
    userName,
    userEmail,
  } = useAuthDisplay();

  return (
    <div
      className={`lg:hidden border-t border-slate-100 bg-white overflow-hidden transition-all duration-300 ease-out ${
        open ? "max-h-[calc(100vh-64px)] opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 py-3 space-y-1 overflow-y-auto max-h-[calc(100vh-80px)]">
        {isResident && (
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2.5 mb-1 text-[14px] font-semibold text-[#0F172A] bg-[#B8860B]/10 hover:bg-[#B8860B]/15 active:scale-[0.98] rounded-lg transition-all duration-200 ease-out"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portal
          </Link>
        )}

        {NAV_LINKS.map((link, idx) => (
          <MobileLinkItem
            key={link.label}
            link={link}
            index={idx}
            active={isLinkActive(pathname, link.href)}
            isOpen={open}
            onNavigate={onClose}
          />
        ))}

        <Link
          href="/document"
          onClick={onClose}
          className="block text-center mt-2 px-4 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] active:scale-[0.98] text-white text-[13.5px] font-semibold rounded-lg transition-all duration-200 ease-out"
        >
          Request Document
        </Link>

        <div className="h-px bg-slate-100 my-2" />

        {isLoading ? null : isAuthenticated ? (
          <>
            <div className="px-3 py-2">
              <p className="text-[13px] font-semibold text-slate-900 truncate">
                {userName || "Resident"}
              </p>
              <p className="text-[12px] text-slate-400 truncate">{userEmail}</p>
            </div>

            <Link
              href="/dashboard"
              onClick={onClose}
              className="block px-3 py-2.5 text-[14px] text-slate-600 hover:bg-slate-50 active:scale-[0.98] rounded-lg transition-all duration-200 ease-out"
            >
              {dashboardLabel}
            </Link>

            <LogoutButton
              onDone={onClose}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-[14px] text-red-600 hover:bg-red-50 active:scale-[0.98] rounded-lg transition-all duration-200 ease-out disabled:opacity-50"
            />
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <Link
              href="/login"
              onClick={onClose}
              className="text-center px-4 py-2.5 border border-slate-200 text-[13.5px] font-semibold text-[#0F172A] active:scale-[0.98] rounded-lg transition-all duration-200 ease-out"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
