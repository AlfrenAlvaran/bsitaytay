import Reveal from "@/components/ui/Reveal";
import { values } from "./about";


const Values = () => {
  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <Reveal className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-[#B8860B]" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
              What guides us
            </p>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Our values
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, description }, i) => (
            <Reveal key={title} delay={i * 60}>
              <div className="border-t border-slate-200 pt-6">
                <Icon className="mb-4 h-6 w-6 text-[#B8860B]" strokeWidth={1.75} />
                <h3 className="mb-2 text-base font-semibold tracking-tight text-slate-900">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Values;