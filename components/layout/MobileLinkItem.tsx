"use client";

import Link from "next/link";
import { LinksChild } from "./nav-links";

type Props = {
  link: LinksChild;
  active: boolean;
  index: number;
  isOpen: boolean;
  onNavigate: () => void;
};

const MobileLinkItem = ({ link, active, index, isOpen, onNavigate }: Props) => {
  return (
    <div
      style={{ transitionDelay: isOpen ? `${index * 40}ms` : "0ms" }}
      className={`transition-all duration-300 ease-out ${
        isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
      }`}
    >
      <Link
        href={link.href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={`w-full flex items-center px-3 py-2.5 text-[14px] font-medium rounded-lg transition-all duration-200 ease-out active:scale-[0.98] ${
          active
            ? "text-slate-900 bg-slate-50"
            : "text-slate-700 hover:bg-slate-50"
        }`}
      >
        {link.label}
      </Link>
    </div>
  );
};

export default MobileLinkItem;
