import Link from "next/link";
import { useAuthDisplay } from "../hooks/useAuthDisplay";
import { ArrowRight, FilePlus, LogIn } from "lucide-react";
import { LogoutButton } from "./LogoutButton";
import UserMenu from "./UserMenu";

type Props = {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
};

const NavAuthArea = ({ variant = "desktop", onNavigate }: Props) => {
  const {
    isAuthenticated,
    isLoading,
    isResident,
    dashboardLabel,
    initials,
    userName,
    userEmail,
  } = useAuthDisplay();

  const mobile = variant === "mobile";

  const ghostLink =
    "group flex items-center gap-1.5 px-3.5 py-2 text-[13.5px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200 ease-out";
  const primaryLink =
    "group relative flex items-center justify-center gap-2 px-4 py-2 bg-[#0F172A] hover:bg-[#1E293B] active:scale-[0.97] text-white text-[13.5px] font-semibold rounded-lg transition-all duration-200 ease-out hover:shadow-lg hover:shadow-slate-900/20 hover:-translate-y-[1px]";
  const outlineLink =
    "group flex items-center justify-center gap-1.5 px-3.5 py-2 text-[13.5px] font-semibold text-[#0F172A] border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.97] rounded-lg transition-all duration-200 ease-out";

  const portalLink = isResident && (
    <Link href={"/dashboard"} onClick={onNavigate} className={ghostLink}>
      <ArrowRight className="w-3.5 h-3.5" />
      Back to Portal
    </Link>
  );

  const requestLink = (
    <Link href="/document" onClick={onNavigate} className={primaryLink}>
      <FilePlus className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:rotate-6" />
      Request Document
    </Link>
  );

  const signInLink = (
    <Link href="/login" onClick={onNavigate} className={outlineLink}>
      <LogIn className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:-translate-x-0.5" />
      Sign In
    </Link>
  );

  if (mobile) {
    return (
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <div className="h-11 w-full rounded-lg bg-slate-100 animate-pulse" />
        ) : isAuthenticated ? (
          <>
            <div className="flex items-center gap-3 px-1 pb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F172A] text-sm font-semibold text-white">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {userName}
                </p>
                <p className="truncate text-xs text-slate-500">{userEmail}</p>
              </div>
            </div>
            {portalLink}
            {requestLink}

            <Link
              href="/dashboard"
              onClick={onNavigate}
              className={outlineLink}
            >
              {dashboardLabel}
            </Link>

            <LogoutButton />
          </>
        ) : (
          <>
            {requestLink}
            {signInLink}
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="w-px h-5 bg-slate-200 mx-2" />
      {portalLink}
      {requestLink}

      {isLoading ? (
        <div className="ml-1 w-9 h-9 rounded-full bg-slate-100 animate-pulse" />
      ) : isAuthenticated ? (
        <UserMenu
          initials={initials}
          userName={userName}
          userEmail={userEmail}
          dashboardLabel={dashboardLabel}
        />
      ) : (
        <div className="flex items-center gap-1.5 ml-1">{signInLink}</div>
      )}
    </>
  );
};

export default NavAuthArea;
