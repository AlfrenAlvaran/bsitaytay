
import Reveal from "@/components/ui/Reveal";
import { missionVision } from "./about";

const MissionVision = () => {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        {missionVision.map(({ label, text }, i) => (
          <Reveal key={label} delay={i * 80}>
            <div className="text-center">
              {i > 0 && (
                <span
                  aria-hidden
                  className="mx-auto mb-16 block h-px w-12 bg-[#B8860B]/40 sm:mb-20"
                />
              )}
              <p className="mb-6 text-sm font-medium tracking-wide text-[#B8860B]">
                {label.replace("Our ", "")}
              </p>
              <blockquote className="font-serif text-2xl italic leading-relaxed text-slate-900 sm:text-3xl sm:leading-[1.6]">
                {text}
              </blockquote>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default MissionVision;