"use client";

import Link from "next/link";
import { NAV_LINKS } from "./nav-links";
import { isLinkActive } from "./nav.utils";
import { useHoverDropdown } from "./useHoverDropdown";

const DesktopLinks = (pathname: string | null) => {
  const { active, open, scheduleClose } = useHoverDropdown();

  return (
    <>
      {NAV_LINKS.map((link) => {
        const activeLink = isLinkActive(pathname, link.href);

        return (
          <div
            key={link.label}
            className="relative"
            onMouseEnter={() => link.children && open(link.label)}
            onMouseLeave={() => link.children && scheduleClose()}
          >
            <Link
              href={link.href}
              className={`group relative flex items-center gap-0.5 px-3.5 py-2 text-[13.5px] font-medium rounded-md transition-all duration-200 ease-out ${
                activeLink
                  ? "text-slate-900"
                  : "text-slate-600 hover:text-slate-900"
              } hover:bg-slate-50`}
            >
              {link.label}
            </Link>
          </div>
        );
      })}
    </>
  );
};

export default DesktopLinks;
