"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { HttpError } from "@/lib/http/client";
import {
  useSetStaffActive,
  useStaffList,
} from "@/features/staff/hooks/useStaffList";
import { PERMISSIONS } from "@/features/staff/constant/staff.constant";

const LABELS: Record<string, string> = Object.fromEntries(
  PERMISSIONS.map((p) => [p.id, p.label]),
);

export default function StaffListPage() {
  const { data, isLoading, isError, refetch } = useStaffList();
  const setActive = useSetStaffActive();
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return data ?? [];
    return (data ?? []).filter((s) =>
      [s.firstName, s.lastName, s.email, s.position, s.employeeId]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [data, q]);

  function toggle(id: string, name: string, active: boolean) {
    const verb = active ? "Deactivate" : "Activate";
    if (!window.confirm(`${verb} ${name}'s account?`)) return;

    setActive.mutate(
      { id, active: !active },
      {
        onSuccess: () =>
          toast.success(`Account ${active ? "deactivated" : "activated"}.`),
        onError: (err) =>
          toast.error(
            err instanceof HttpError
              ? err.message
              : "Something went wrong. Please try again.",
          ),
      },
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Staff accounts
          </h1>
          <p className="mt-1 text-slate-600">
            Manage who can sign in to the staff portal.
          </p>
        </div>
        <Link
          href="/admin/staff/new"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Plus className="size-4" /> Create staff account
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, email, position"
          className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 shadow-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/60 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Position</th>
                <th className="px-5 py-3 font-semibold">Permissions</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-5 py-4">
                      <div className="h-5 w-full animate-pulse rounded bg-slate-100" />
                    </td>
                  </tr>
                ))}

              {isError && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center">
                    <p className="text-slate-600">
                      Couldn&apos;t load staff accounts.
                    </p>
                    <button
                      onClick={() => refetch()}
                      className="mt-2 text-sm font-semibold text-amber-700 hover:underline"
                    >
                      Try again
                    </button>
                  </td>
                </tr>
              )}

              {!isLoading && !isError && rows.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    {q ? "No matching staff." : "No staff accounts yet."}
                  </td>
                </tr>
              )}

              {rows.map((s) => {
                const name = `${s.firstName} ${s.lastName}`;
                return (
                  <tr key={s.id} className="align-top hover:bg-slate-50/50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">{name}</p>
                      <p className="text-[13px] text-slate-500">{s.email}</p>
                      {s.employeeId && (
                        <p className="text-xs text-slate-400">
                          ID {s.employeeId}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-700">{s.position}</td>
                    <td className="px-5 py-4">
                      <div className="flex max-w-xs flex-wrap gap-1.5">
                        {s.permissions.map((p) => (
                          <span
                            key={p}
                            className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800"
                          >
                            {LABELS[p] ?? p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          s.active
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {s.active ? "Active" : "Deactivated"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => toggle(s.id, name, s.active)}
                        disabled={setActive.isPending}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
                      >
                        {s.active ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}