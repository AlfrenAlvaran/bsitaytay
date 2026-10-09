'use client'
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { FilePlus2 } from "lucide-react";
import Link from "next/link";
import React from "react";

const ResidentPageHome = () => {
  const {data:user} = useCurrentUser()


  return (
    <>
      <section className="flex flex-wrap items-end justify-between gap-5 rounded-2xl border-l-[6px] border-amber-500 bg-slate-900 p-7 text-white">
        <div>
          <h1 className="mb-1.5 text-3xl font-extrabold tracking-tight">
            Magandang araw, {user?.firstName} {user?.lastName}
          </h1>
          <p className="max-w-[46ch] text-slate-400">
            Your barangay clearance is ready for pickup. Bring a valid ID to the
            Barangay Hall.
          </p>
        </div>
        <Link
          href="/resident/request"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900"
        >
          <FilePlus2 className="size-4" />
          Request a document
        </Link>
      </section>
    </>
  );
};

export default ResidentPageHome;
