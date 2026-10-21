"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Briefcase, CheckCircle2, Eye, EyeOff, KeyRound,
  RefreshCw, ShieldCheck, User, type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { HttpError } from "@/lib/http/client";
import { staffApi } from "@/features/staff/api/staff.api";
import {
  POSITIONS,
  PERMISSIONS,
  PRESETS,
  type PermissionId,
  type Position,
} from "@/features/staff/constant/staff.constant";

type Form = {
  firstName: string; lastName: string; email: string; mobile: string;
  employeeId: string; position: Position; startDate: string;
  permissions: PermissionId[]; password: string; confirm: string; mustChange: boolean;
};

const EMPTY: Form = {
  firstName: "", lastName: "", email: "", mobile: "", employeeId: "",
  position: "Records Clerk", startDate: "", permissions: PRESETS["Front desk"],
  password: "", confirm: "", mustChange: true,
};

const NAME_RE = /^[\p{L}\p{M}'’ .-]+$/u;
const NAME_MSG = "Use letters, spaces, apostrophes, periods or hyphens only";

const input =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 aria-[invalid=true]:border-red-500";
const lbl = "mb-1.5 block text-sm font-medium text-slate-700";

function strength(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p) || p.length >= 14) s++;
  return s;
}
const STRENGTH = [
  ["Too short", "bg-slate-300", "text-slate-500"],
  ["Weak", "bg-red-500", "text-red-600"],
  ["Fair", "bg-yellow-500", "text-yellow-600"],
  ["Good", "bg-lime-500", "text-lime-600"],
  ["Strong", "bg-green-600", "text-green-700"],
] as const;

function generate() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  const bytes = crypto.getRandomValues(new Uint32Array(14));
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

function Section({ icon: Icon, title, desc, children }: { icon: LucideIcon; title: string; desc: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/60 px-6 py-4">
        <span className="grid size-9 place-items-center rounded-lg bg-slate-900 text-white"><Icon className="size-[18px]" /></span>
        <div>
          <h2 className="font-semibold leading-tight text-slate-900">{title}</h2>
          <p className="text-[13px] text-slate-500">{desc}</p>
        </div>
      </header>
      <div className="grid gap-5 p-6 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export default function CreateStaffPage() {
  const [f, setF] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState(false);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));
  const toggle = (id: PermissionId) =>
    set("permissions", f.permissions.includes(id) ? f.permissions.filter((x) => x !== id) : [...f.permissions, id]);
  const score = f.password ? Math.max(1, strength(f.password)) : 0;
  const [sLabel, sBar, sText] = STRENGTH[f.password.length < 8 ? 0 : score];
  const fullName = `${f.firstName} ${f.lastName}`.trim();
  const initials = ((f.firstName[0] ?? "") + (f.lastName[0] ?? "")).toUpperCase() || "?";

  function validate() {
    const e: Record<string, string> = {};

    if (!f.firstName.trim()) e.firstName = "Required";
    else if (!NAME_RE.test(f.firstName.trim())) e.firstName = NAME_MSG;

    if (!f.lastName.trim()) e.lastName = "Required";
    else if (!NAME_RE.test(f.lastName.trim())) e.lastName = NAME_MSG;

    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email";
    if (!/^(09|\+639)\d{9}$/.test(f.mobile.replace(/[\s()-]/g, ""))) e.mobile = "Use 09XXXXXXXXX or +639XXXXXXXXX";
    if (!f.startDate) e.startDate = "Choose a start date";
    if (f.password.length < 8) e.password = "At least 8 characters";
    if (f.confirm !== f.password) e.confirm = "Passwords do not match";
    if (f.permissions.length === 0) e.permissions = "Select at least one permission";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await staffApi.create({
        firstName: f.firstName.trim(),
        lastName: f.lastName.trim(),
        email: f.email.trim(),
        mobile: f.mobile,
        position: f.position,
        employeeId: f.employeeId || undefined,
        startDate: f.startDate,
        permissions: f.permissions,
        password: f.password,
        mustChangePassword: f.mustChange,
      });
      setCreated(true);
    } catch (err) {
      if (err instanceof HttpError && err.status !== 0) {
        const fe = err.fieldErrors ?? {};
        const keys = [
          "firstName",
          "lastName",
          "email",
          "mobile",
          "startDate",
          "password",
          "permissions",
          "employeeId",
        ];
        const mapped: Record<string, string> = {};
        for (const k of keys) if (fe[k]) mapped[k] = fe[k];

        if (Object.keys(mapped).length) setErrors(mapped);
        else toast.error(err.message);
      } else {
        toast.error("Network error. Please check your connection and try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  if (created) {
    return (
      <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto size-12 text-green-600" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Account created</h1>
        <p className="mt-2 text-slate-600">
          {fullName} can now sign in at the staff portal with <span className="font-medium text-slate-900">{f.email}</span>.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/admin/staff" className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">Back to staff</Link>
          <button onClick={() => { setCreated(false); setF(EMPTY); setErrors({}); }} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50">Add another</button>
        </div>
      </section>
    );
  }

  const Err = ({ k }: { k: string }) => (errors[k] ? <p className="mt-1.5 text-xs font-medium text-red-600">{errors[k]}</p> : null);

  return (
    <>
      <div>
        <Link href="/admin/staff" className="mb-2 inline-flex items-center gap-1 text-[13px] font-medium text-slate-500 hover:text-slate-900">
          <ArrowLeft className="size-3.5" /> Staff accounts
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Create staff account</h1>
        <p className="mt-1 text-slate-600">The account is active as soon as you create it.</p>
      </div>

      <form onSubmit={onSubmit} noValidate className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex min-w-0 flex-col gap-6">
          <Section icon={User} title="Personal information" desc="Who this account belongs to">
            <div><label htmlFor="fn" className={lbl}>First name</label><input id="fn" value={f.firstName} onChange={(e) => set("firstName", e.target.value)} aria-invalid={!!errors.firstName} className={input} /><Err k="firstName" /></div>
            <div><label htmlFor="ln" className={lbl}>Last name</label><input id="ln" value={f.lastName} onChange={(e) => set("lastName", e.target.value)} aria-invalid={!!errors.lastName} className={input} /><Err k="lastName" /></div>
            <div><label htmlFor="email" className={lbl}>Email (used to sign in)</label><input id="email" type="email" value={f.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} className={input} /><Err k="email" /></div>
            <div><label htmlFor="mobile" className={lbl}>Mobile number</label><input id="mobile" inputMode="tel" placeholder="09XX XXX XXXX" value={f.mobile} onChange={(e) => set("mobile", e.target.value)} aria-invalid={!!errors.mobile} className={input} /><Err k="mobile" /></div>
          </Section>

          <Section icon={Briefcase} title="Employment" desc="Role within the barangay office">
            <div><label htmlFor="pos" className={lbl}>Position</label><select id="pos" value={f.position} onChange={(e) => set("position", e.target.value as Position)} className={input}>{POSITIONS.map((p) => <option key={p}>{p}</option>)}</select></div>
            <div><label htmlFor="start" className={lbl}>Start date</label><input id="start" type="date" value={f.startDate} onChange={(e) => set("startDate", e.target.value)} aria-invalid={!!errors.startDate} className={input} /><Err k="startDate" /></div>
            <div className="sm:col-span-2">
              <label htmlFor="eid" className={lbl}>Employee ID <span className="font-normal text-slate-400">(optional)</span></label>
              <input id="eid" value={f.employeeId} onChange={(e) => set("employeeId", e.target.value)} aria-invalid={!!errors.employeeId} className={input} />
              <Err k="employeeId" />
            </div>
          </Section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-slate-900 text-white"><ShieldCheck className="size-[18px]" /></span>
                <div><h2 className="font-semibold leading-tight text-slate-900">Permissions</h2><p className="text-[13px] text-slate-500">What this person can do</p></div>
              </div>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Permission presets">
                {Object.entries(PRESETS).map(([name, ids]) => (
                  <button key={name} type="button" onClick={() => set("permissions", ids)} className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-400 hover:bg-white">{name}</button>
                ))}
              </div>
            </header>
            <div className="p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {PERMISSIONS.map((p) => {
                  const on = f.permissions.includes(p.id);
                  return (
                    <label key={p.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition focus-within:ring-4 focus-within:ring-amber-500/15 ${on ? "border-amber-500 bg-amber-50/60" : "border-slate-200 hover:border-slate-300"}`}>
                      <input type="checkbox" checked={on} onChange={() => toggle(p.id)} className="mt-1 size-4 accent-amber-600" />
                      <span><span className="block text-sm font-semibold text-slate-900">{p.label}</span><span className="block text-[13px] text-slate-500">{p.desc}</span></span>
                    </label>
                  );
                })}
              </div>
              <Err k="permissions" />
              <p className="mt-3 text-xs text-slate-500">Reports, analytics and staff management are always admin-only.</p>
            </div>
          </section>

          <Section icon={KeyRound} title="Password" desc="Set the password they will sign in with">
            <div>
              <label htmlFor="pw" className={lbl}>Password</label>
              <div className="relative">
                <input id="pw" type={show ? "text" : "password"} autoComplete="new-password" value={f.password} onChange={(e) => set("password", e.target.value)} aria-invalid={!!errors.password} className={`${input} pr-10`} />
                <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <Err k="password" />
              {f.password && (
                <div className="mt-2">
                  <div className="flex gap-1">{[1, 2, 3, 4].map((i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= score && f.password.length >= 8 ? sBar : "bg-slate-200"}`} />)}</div>
                  <p className={`mt-1 text-xs font-medium ${sText}`}>{sLabel}</p>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="cf" className={lbl}>Confirm password</label>
              <input id="cf" type={show ? "text" : "password"} autoComplete="new-password" value={f.confirm} onChange={(e) => set("confirm", e.target.value)} aria-invalid={!!errors.confirm} className={input} />
              <Err k="confirm" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700">
                <input type="checkbox" checked={f.mustChange} onChange={(e) => set("mustChange", e.target.checked)} className="size-4 accent-amber-600" />
                Ask them to change it at first sign-in
              </label>
              <button type="button" onClick={() => { const p = generate(); setF((x) => ({ ...x, password: p, confirm: p })); setShow(true); }} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50">
                <RefreshCw className="size-4" /> Generate password
              </button>
            </div>
          </Section>
        </div>

        <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-24">
          <div className="bg-slate-900 p-6 text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-full border-2 border-amber-500 bg-slate-800 text-xl font-bold text-white">{initials}</div>
            <p className="mt-3 font-semibold text-white">{fullName || "New staff member"}</p>
            <p className="text-sm text-slate-400">{f.position}</p>
          </div>
          <div className="space-y-4 p-5 text-sm">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Can</p>
              <div className="flex flex-wrap gap-1.5">
                {f.permissions.length === 0 && <span className="text-slate-400">Nothing selected</span>}
                {PERMISSIONS.filter((p) => f.permissions.includes(p.id)).map((p) => (
                  <span key={p.id} className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">{p.label}</span>
                ))}
              </div>
            </div>
            <button type="submit" disabled={saving} className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60">
              {saving ? "Creating…" : "Create account"}
            </button>
            <Link href="/admin/staff" className="block text-center font-medium text-slate-500 hover:text-slate-900">Cancel</Link>
          </div>
        </aside>
      </form>
    </>
  );
}