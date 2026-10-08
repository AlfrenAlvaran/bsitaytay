"use client";

import { useScrollShadow } from "@/hooks/useScrollShadow";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navShellClass } from "./nav.utils";

import DesktopLinks from "./DesktopLinks";

import MobileMenuButton from "./MobileMenuButton";
import MobileMenu from "./MobileMenu";
import Logo from "../ui/Logo";
import NavAuthArea from "@/features/auth/components/NavAuthArea";

const Navbar = () => {
  const pathname = usePathname();

  const scrolled = useScrollShadow();

  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <nav className={navShellClass(scrolled)}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />

          <div className="hidden lg:flex items-center gap-0.5">
            {DesktopLinks(pathname)}
            <NavAuthArea />
          </div>

          <MobileMenuButton
            open={mobileOpen}
            onToggle={() => setMobileOpen((prev) => !prev)}
          />
        </div>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </nav>
  );
};

export default Navbar;
