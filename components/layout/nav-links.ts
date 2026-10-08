export type LinksChild = {
  label: string;
  href: string;
  children?: string;
};

export const NAV_LINKS: LinksChild[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
  {
    label: "Document",
    href: "/document",
  },
  {
    label: "Announcement",
    href: "/announcement",
  },
];
