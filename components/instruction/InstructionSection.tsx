"use client";


import Reveal from "@/components/ui/Reveal";
import InstructionStep from "./InstructionStep";
import { instructions } from "./instruction";

const Instruction = () => {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <Reveal className="mb-14">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-[#B8860B]" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
              Process
            </p>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How to request a certificate
          </h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-500">
            Five simple steps, from register to pickup.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-5">
          {instructions.map((item, i) => (
            <Reveal key={item.step} delay={i * 60}>
              <InstructionStep
                {...item}
                isLast={i === instructions.length - 1}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Instruction;