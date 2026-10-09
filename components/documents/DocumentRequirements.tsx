import { Check } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { RequirementProps } from "./requirements";



type Props = {
  requirements: RequirementProps[];
};

const RequirementsSection = ({ requirements }: Props) => (
  <section className="bg-white py-20 sm:py-28">
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 sm:px-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
      <Reveal>
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-[#B8860B]" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
            Before you apply
          </p>
        </div>
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          What you&apos;ll generally need
        </h2>
        <p className="max-w-sm text-base leading-relaxed text-slate-500">
          Requirements vary slightly by document. Specific requirements are
          shown when you start a request.
        </p>
      </Reveal>

      <ul className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        {requirements.map((r, i) => (
          <Reveal key={r.title} delay={i * 60}>
            <li className="flex gap-4 border-t border-slate-200 pt-5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#B8860B]/10 text-[#B8860B]">
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
              <div>
                <h3 className="mb-1 text-sm font-semibold text-slate-900">
                  {r.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">{r.desc}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ul>
    </div>
  </section>
);

export default RequirementsSection;