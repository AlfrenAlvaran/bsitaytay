"use client";

import { Menu, X } from "lucide-react";

type Props = {
  open: boolean;
  onToggle: () => void;
};

const MobileMenuButton = ({ open, onToggle }: Props) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="lg:hidden relative p-2 -mr-2 text-slate-600 hover:text-slate-900 transition-colors duration-200"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
    >
      {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </button>
  );
};

export default MobileMenuButton;
