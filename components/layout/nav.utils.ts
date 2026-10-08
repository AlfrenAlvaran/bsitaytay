export function isLinkActive(pathname: string | null, href: string) {
  return pathname === href || (href !== "/" && !!pathname?.startsWith(href));
}

export function navShellClass(scrolled: boolean) {
  return `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
    scrolled
      ? "bg-white/80 backdrop-blur-md border-b border-slate-200/70 shadow-[0_1px_0_0_rgba(15,23,42,0.04)]"
      : "bg-white border-b border-transparent"
  }`;
}
