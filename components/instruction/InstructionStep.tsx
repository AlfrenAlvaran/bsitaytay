import type { InstructionItem } from "./instruction";

type Props = InstructionItem & {
  isLast?: boolean;
};

const InstructionStep = ({ step, title, description, isLast }: Props) => {
  return (
    <div className="group relative flex gap-5 lg:block">
      {!isLast && (
        <span
          aria-hidden
          className="absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-px bg-slate-200
                     lg:left-10 lg:top-[19px] lg:h-px lg:w-[calc(100%-2.5rem)]"
        />
      )}

      <div
        className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                   border border-slate-200 bg-white text-xs font-semibold tracking-wider text-[#B8860B]
                   transition-colors duration-200 group-hover:border-[#B8860B]"
      >
        {step}
      </div>

      <div className="pb-10 lg:mt-6 lg:pb-0 lg:pr-6">
        <h3 className="mb-2 text-base font-semibold tracking-tight text-slate-900">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-slate-500">{description}</p>
      </div>
    </div>
  );
};

export default InstructionStep;
