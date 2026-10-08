import Link from "next/link";
import { ArrowRight, FilePlus } from "lucide-react";
import Hero from "@/components/layout/hero/Hero";


const HomeHero = () => {
  return (
    <Hero
      image="/hero.webp"
      minHeight="90vh"
      eyebrow="Republic of the Philippines · Province of Rizal"
      title={
        <>
          Barangay San Isidro
          <span className="block text-slate-400 font-light text-3xl sm:text-4xl lg:text-5xl mt-2">
            Serving our community
          </span>
        </>
      }
      description="Transparent governance and efficient public service delivery for every resident of Barangay San Isidro."
      showScrollCue
      actions={
        <>
          <Link
            href="/document"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#B8860B] active:scale-[0.97] text-slate-900 hover:text-white text-sm font-semibold rounded-lg transition-all duration-200"
          >
            <FilePlus className="w-4 h-4 transition-transform group-hover:rotate-12" />
            Request a Document
          </Link>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 border border-slate-700 hover:border-[#B8860B] hover:bg-[#B8860B]/10 text-slate-300 hover:text-[#B8860B] text-sm font-medium rounded-lg transition-all duration-200"
          >
            View Services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </>
      }
    />
  );
};

export default HomeHero;