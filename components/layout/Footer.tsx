import Link from "next/link";
import { MapPin, Phone, Clock, ShieldAlert, LifeBuoy } from "lucide-react";
import Logo from "../ui/Logo";
import { NAV_LINKS } from "./nav-links";

import { cacheLife } from "next/cache";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.026 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.931-1.956 1.886v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
  </svg>
);

const hotlines = [
  { icon: Phone, label: "Barangay Hall", value: "(02) 8650-0139" },
  { icon: ShieldAlert, label: "Tanod", value: "(02) 8669-1096" },
  { icon: LifeBuoy, label: "Rescue Team", value: "0999-882-8218" },
];

const toTel = (value: string) => `tel:${value.replace(/[^\d+]/g, "")}`;

const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-6xl px-6 pb-8 pt-16 sm:px-8">
        <div className="mb-14 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
              Committed to transparent governance and the efficient delivery of
              public services to our community.
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <p className="flex items-start gap-3 text-slate-400">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#B8860B]"
                  strokeWidth={1.75}
                />
                Aquarius Street, Brgy. San Isidro, Taytay, Rizal
              </p>
              <p className="flex items-start gap-3 text-slate-400">
                <Clock
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#B8860B]"
                  strokeWidth={1.75}
                />
                Mon–Fri, 8:30 AM – 4:30 PM
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              Navigation
            </p>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              Hotlines
            </p>
            <ul className="space-y-3">
              {hotlines.map(({ icon: Icon, label, value }) => (
                <li key={label}>
                  <a
                    href={toTel(value)}
                    className="group flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-colors hover:border-white/15 hover:bg-white/5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#B8860B] ring-1 ring-inset ring-white/10">
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <span>
                      <span className="block text-xs text-slate-500">
                        {label}
                      </span>
                      <span className="block text-sm font-medium text-slate-200 transition-colors group-hover:text-white">
                        {value}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs sm:flex-row">
          <p className="text-slate-600">
            © <CurrentYear /> Barangay San Isidro. Developed by{" "}
            <a
              href="https://web.facebook.com/alvaran.alfren/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-400 transition-colors hover:text-white"
            >
              Alfren Alvaran
              <FacebookIcon className="h-3 w-3" />
            </a>
            , Student of Saint John Paul II.
          </p>
          <p className="text-slate-700">
            Republic of the Philippines · Local Government Unit
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
