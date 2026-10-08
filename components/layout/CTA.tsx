"use client";

import Link from "next/link";
import { ArrowRight, Clock, FileText, MapPin, Phone } from "lucide-react";
import Reveal from "../ui/Reveal";

const details = [
  {
    icon: MapPin,
    label: "Address",
    value: "Aquarius Street, Brgy. San Isidro, Taytay, Rizal",
  },
  {
    icon: Clock,
    label: "Office hours",
    value: "Mon–Fri, 8:00 AM – 5:00 PM",
  },
  {
    icon: Phone,
    label: "Hotline",
    value: "(02) 8-527-1234",
  },
];

const CTA = () => {
  return (
    <section className="relative overflow-hidden bg-[#0F172A]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#B8860B]/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <Reveal>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-[#B8860B]" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
                  Get in touch
                </p>
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Need a document or have a concern?
              </h3>
              <p className="mt-3 text-base leading-relaxed text-slate-400">
                Request online in minutes, or visit the barangay hall and our
                staff will assist you.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/request"
                className="group inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-all duration-200 hover:bg-[#B8860B] hover:text-white"
              >
                <FileText className="h-4 w-4" strokeWidth={2} />
                Request a Document
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-lg border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:border-white/40 hover:bg-white/5"
              >
                Contact the Office
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </Link>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
            {details.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-start gap-4 bg-[#0F172A] p-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#B8860B] ring-1 ring-inset ring-white/10">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    {label}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-200">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default CTA;
