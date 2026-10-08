"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ServiceCard from "./ServiceCard";
import Reveal from "@/components/ui/Reveal";
import { documents } from "./services";

const ServiceSection = () => {
  return (
    <section
      id="services"
      className="bg-gradient-to-b from-slate-50 to-white py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <Reveal className="mb-14">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-[#B8860B]" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
                  What we offer
                </p>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Barangay Documents
              </h2>
              <p className="mt-3 text-base leading-relaxed text-slate-500">
                Request certificates, clearances, and permits online. Faster
                processing, less waiting in line.
              </p>
            </div>

            <Link
              href="/documents"
              className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 
                         text-sm font-medium text-slate-700 shadow-sm 
                         transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white"
            >
              View all Document
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {documents.slice(0, 6).map((service, index) => (
            <Reveal key={service.title} delay={index * 60} className="h-full">
              <ServiceCard {...service} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
