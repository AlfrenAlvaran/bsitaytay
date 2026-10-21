"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, ArrowRight } from "lucide-react";

type RangeKey = "7d" | "30d";

const DATA = {
  "7d": {
    label: "Last 7 days",
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    received: [18, 24, 21, 29, 26, 8, 4],
    released: [14, 19, 20, 22, 25, 6, 2],
    kpis: [
      { label: "Requests received", value: "130", delta: 11, up: true, spark: [18, 24, 21, 29, 26, 8, 4] },
      { label: "Released", value: "108", delta: 8, up: true, spark: [14, 19, 20, 22, 25, 6, 2] },
      { label: "Avg. turnaround", value: "1.5 days", delta: -10, up: false, spark: [2.1, 1.9, 1.8, 1.6, 1.5, 1.5, 1.5] },
      { label: "Fees collected", value: "₱5,120", delta: 6, up: true, spark: [600, 900, 750, 1100, 980, 500, 290] },
    ],
  },
  "30d": {
    label: "Last 30 days",
    labels: ["W1", "W2", "W3", "W4"],
    received: [31, 38, 34, 39],
    released: [26, 32, 29, 31],
    kpis: [
      { label: "Requests received", value: "142", delta: 14, up: true, spark: [31, 38, 34, 39] },
      { label: "Released", value: "118", delta: 9, up: true, spark: [26, 32, 29, 31] },
      { label: "Avg. turnaround", value: "1.6 days", delta: -12, up: false, spark: [2.1, 1.8, 1.7, 1.6] },
      { label: "Fees collected", value: "₱6,840", delta: 7, up: true, spark: [1500, 1900, 1700, 1740] },
    ],
  },
} as const;

const STATUS = [
  { name: "Released", value: 118, color: "#16a34a" },
  { name: "In review", value: 12, color: "#eab308" },
  { name: "Ready for pickup", value: 7, color: "#0ea5e9" },
  { name: "Rejected", value: 5, color: "#94a3b8" },
];

const TOP_DOCS = [
  { name: "Barangay clearance", value: 61 },
  { name: "Certificate of residency", value: 38 },
  { name: "Certificate of indigency", value: 29 },
  { name: "Business clearance", value: 14 },
];

const QUEUE = [
  { ref: "BSI-2026-0425", resident: "Ramon Cruz", doc: "Business clearance", age: "3 days", overdue: true },
  { ref: "BSI-2026-0428", resident: "Liza Gonzales", doc: "Certificate of residency", age: "2 days", overdue: false },
  { ref: "BSI-2026-0430", resident: "Mark Villanueva", doc: "Certificate of indigency", age: "5 hrs", overdue: false },
  { ref: "BSI-2026-0431", resident: "Ana Reyes", doc: "Barangay clearance", age: "3 hrs", overdue: false },
];

const STAFF = [
  { name: "Maria Santos", handled: 52, share: 100 },
  { name: "Jose Ramos", handled: 47, share: 90 },
  { name: "Elena Cruz", handled: 19, share: 37 },
];

const ALERTS = [
  "1 request has waited more than 3 days",
  "7 documents are ready but not yet picked up",
  "9 new residents are waiting for verification",
];

function Spark({ data, good }: { data: readonly number[]; good: boolean }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * 80},${26 - ((v - min) / (max - min || 1)) * 22}`)
    .join(" ");
  return (
    <svg viewBox="0 0 80 28" className="h-7 w-20" aria-hidden>
      <polyline points={pts} fill="none" stroke={good ? "#16a34a" : "#dc2626"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrendChart({ labels, a, b }: { labels: readonly string[]; a: readonly number[]; b: readonly number[] }) {
  const W = 600, H = 220, P = { l: 30, r: 10, t: 12, b: 26 };
  const max = Math.ceil(Math.max(...a, ...b) / 10) * 10;
  const x = (i: number) => P.l + (i / (labels.length - 1)) * (W - P.l - P.r);
  const y = (v: number) => P.t + (1 - v / max) * (H - P.t - P.b);
  const line = (s: readonly number[]) => s.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
  const area = `${line(a)} L${x(a.length - 1)},${H - P.b} L${x(0)},${H - P.b} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img"
      aria-label={`Received: ${a.join(", ")}. Released: ${b.join(", ")}.`}>
      {[0, 0.5, 1].map((t) => (
        <g key={t}>
          <line x1={P.l} x2={W - P.r} y1={y(max * t)} y2={y(max * t)} stroke="#e2e8f0" />
          <text x={P.l - 6} y={y(max * t)} textAnchor="end" dominantBaseline="central" className="fill-slate-400 text-[11px]">{Math.round(max * t)}</text>
        </g>
      ))}
      <path d={area} fill="#f59e0b" opacity="0.12" />
      <path d={line(a)} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinejoin="round" />
      <path d={line(b)} fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinejoin="round" />
      {a.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="3.5" fill="#f59e0b" />)}
      {b.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="3.5" fill="#0f172a" />)}
      {labels.map((l, i) => (
        <text key={l} x={x(i)} y={H - 6} textAnchor="middle" className="fill-slate-500 text-[11px]">{l}</text>
      ))}
    </svg>
  );
}

function Donut() {
  const total = STATUS.reduce((s, d) => s + d.value, 0), r = 48, c = 2 * Math.PI * r;
  let off = 0;
  return (
    <svg viewBox="0 0 130 130" className="size-36 flex-none -rotate-90" role="img" aria-label="Requests by status">
      <circle cx="65" cy="65" r={r} fill="none" stroke="#e2e8f0" strokeWidth="16" />
      {STATUS.map((d) => {
        const len = (d.value / total) * c;
        const el = <circle key={d.name} cx="65" cy="65" r={r} fill="none" stroke={d.color} strokeWidth="16" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-off} />;
        off += len;
        return el;
      })}
      <text x="65" y="65" transform="rotate(90 65 65)" textAnchor="middle" dominantBaseline="central" className="fill-slate-900 text-[22px] font-bold">{total}</text>
    </svg>
  );
}

const card = "min-w-0 rounded-xl border border-slate-200 bg-white";

export default function AdminOverviewPage() {
  const [range, setRange] = useState<RangeKey>("7d");
  const d = DATA[range];
  const maxDoc = TOP_DOCS[0].value;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Overview</h1>
          <p className="text-slate-600">How barangay document services are performing.</p>
        </div>
        <div className="flex items-center gap-2">
          <div role="tablist" aria-label="Date range" className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
            {(Object.keys(DATA) as RangeKey[]).map((k) => (
              <button key={k} role="tab" aria-selected={range === k} onClick={() => setRange(k)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${range === k ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"}`}>
                {DATA[k].label.replace("Last ", "")}
              </button>
            ))}
          </div>
          <Link href="/admin/reports" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Full reports <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Key metrics">
        {d.kpis.map((k) => {
          const good = k.up === k.delta > 0;
          const Arrow = k.delta > 0 ? ArrowUpRight : ArrowDownRight;
          return (
            <div key={k.label} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-medium text-slate-500">{k.label}</p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{k.value}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${good ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  <Arrow className="size-3" />{Math.abs(k.delta)}%
                </span>
                <Spark data={k.spark} good={good} />
              </div>
            </div>
          );
        })}
      </section>

      {/* Trend + status */}
      <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        <section className={`${card} p-5`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-semibold text-slate-900">Requests received vs released</h2>
              <p className="text-[13px] text-slate-500">{d.label}</p>
            </div>
            <div className="flex gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-amber-500" />Received</span>
              <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-slate-900" />Released</span>
            </div>
          </div>
          <div className="mt-3"><TrendChart labels={d.labels} a={d.received} b={d.released} /></div>
        </section>

        <section className={`${card} p-5`}>
          <h2 className="font-semibold text-slate-900">Status breakdown</h2>
          <div className="mt-4 flex flex-wrap items-center gap-5">
            <Donut />
            <ul className="min-w-0 flex-1 space-y-2.5 text-sm">
              {STATUS.map((s) => (
                <li key={s.name} className="flex items-center gap-2">
                  <span className="size-2.5 flex-none rounded-full" style={{ background: s.color }} />
                  <span className="text-slate-700">{s.name}</span>
                  <span className="ml-auto font-semibold text-slate-900">{s.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Attention */}
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-4" aria-label="Needs attention">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-amber-900">
          <AlertTriangle className="size-4" /> Needs attention
        </h2>
        <ul className="mt-2 grid gap-1.5 text-sm text-amber-900 sm:grid-cols-3">
          {ALERTS.map((a) => <li key={a} className="rounded-lg bg-white/60 px-3 py-2">{a}</li>)}
        </ul>
      </section>

      {/* Queue + docs + staff */}
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <section className={card}>
          <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-900">Oldest pending requests</h2>
            <Link href="/admin/requests" className="text-[13px] font-medium text-slate-500 hover:text-slate-900">Open queue</Link>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="text-[13px] text-slate-500">
                <tr>{["Resident", "Document", "Waiting", ""].map((h, i) => <th key={i} className="px-5 py-3 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody>
                {QUEUE.map((r) => (
                  <tr key={r.ref} className="border-t border-slate-200">
                    <td className="whitespace-nowrap px-5 py-3">
                      <span className="block font-medium text-slate-900">{r.resident}</span>
                      <span className="text-xs text-slate-500">{r.ref}</span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3">{r.doc}</td>
                    <td className="whitespace-nowrap px-5 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${r.overdue ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"}`}>{r.age}</span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-right">
                      <Link href={`/admin/requests/${r.ref}`} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-slate-50">Review</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex min-w-0 flex-col gap-4">
          <section className={`${card} p-5`}>
            <h2 className="font-semibold text-slate-900">Most requested</h2>
            <ul className="mt-4 space-y-3.5">
              {TOP_DOCS.map((x) => (
                <li key={x.name}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-slate-700">{x.name}</span>
                    <span className="font-semibold text-slate-900">{x.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-amber-500" style={{ width: `${(x.value / maxDoc) * 100}%` }} /></div>
                </li>
              ))}
            </ul>
          </section>

          <section className={`${card} p-5`}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Staff workload</h2>
              <Link href="/admin/staff" className="text-[13px] font-medium text-slate-500 hover:text-slate-900">Manage</Link>
            </div>
            <ul className="mt-4 space-y-3.5">
              {STAFF.map((s) => (
                <li key={s.name}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-slate-700">{s.name}</span>
                    <span className="font-semibold text-slate-900">{s.handled}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-slate-900" style={{ width: `${s.share}%` }} /></div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}