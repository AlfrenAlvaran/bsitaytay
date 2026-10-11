import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Home } from "lucide-react";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-6 py-16">
      {/* Soft background accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-[#B8860B]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-slate-900/10 blur-3xl"
      />

      <div className="relative w-full max-w-md text-center">
        <div className="mx-auto mb-6 grid size-16 place-items-center rounded-full bg-slate-900 p-1 shadow-lg">
          <Image
            src="/barangay-logo.svg"
            alt="Barangay logo"
            width={64}
            height={64}
            className="rounded-full"
          />
        </div>

        <p className="text-7xl font-extrabold tracking-tight text-[#B8860B] sm:text-8xl">
          404
        </p>

        <h1 className="mt-4 text-xl font-semibold text-slate-900 sm:text-2xl">
          We can&apos;t find that page
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          The page you&apos;re looking for may have been moved, renamed, or
          never existed. Check the address or head back to a page below.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0F172A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1E293B] active:scale-[0.99] sm:w-auto"
          >
            <Home className="size-4" aria-hidden="true" />
            Go to home
          </Link>
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to sign in
          </Link>
        </div>

        <p className="mt-10 text-xs text-slate-400">
          Need help? Visit the Barangay Hall, Monday to Friday, 8:00 AM to 5:00
          PM.
        </p>
      </div>
    </main>
  );
}