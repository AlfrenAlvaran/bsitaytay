import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  variant?: "light" | "dark";
  stacked?: boolean;
};

const theme = {
  light: {
    ring: "group-hover:ring-slate-200",
    name: "font-medium text-slate-900",
    dot: "text-slate-300",
    place: "text-slate-400",
    tagline: "text-slate-400",
  },
  dark: {
    ring: "group-hover:ring-white/20",
    name: "font-semibold text-white",
    dot: "text-slate-600",
    place: "text-slate-400",
    tagline: "text-slate-500",
  },
} as const;

const Logo = ({ variant = "light", stacked = false }: LogoProps) => {
  const t = theme[variant];

  return (
    <Link
      href="/"
      aria-label="Brgy. San Isidro, Taytay Rizal - Home"
      className="group flex items-center gap-2.5 transition-transform duration-200 ease-out hover:scale-[1.01] active:scale-[0.99]"
    >
      <span
        className={`shrink-0 overflow-hidden rounded-full ring-1 ring-transparent transition-all duration-300 ${t.ring}`}
      >
        <Image
          src="/barangay-logo.svg"
          alt=""
          width={40}
          height={40}
          loading="eager"
          className="transition-transform duration-500 ease-out group-hover:rotate-[8deg]"
        />
      </span>

      <span className="flex min-w-0 flex-col gap-0.5">
        <span
          className={`flex gap-1.5 whitespace-nowrap ${
            stacked ? "flex-col gap-0.5" : "items-baseline"
          }`}
        >
          <span className={`text-[15px] leading-none tracking-tight ${t.name}`}>
            Brgy. San Isidro
          </span>

          {!stacked && (
            <span className={`hidden text-xs sm:inline ${t.dot}`}>.</span>
          )}

          <span
            className={`text-[11px] font-medium leading-none ${t.place} ${
              stacked ? "" : "hidden sm:inline"
            }`}
          >
            Taytay Rizal
          </span>
        </span>

        <span
          className={`whitespace-nowrap text-[10px] font-medium uppercase leading-none tracking-[0.12em] ${t.tagline}`}
        >
          Local Government Unit
        </span>
      </span>
    </Link>
  );
};

export default Logo;