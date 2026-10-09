"use client";

import Link from "next/link";
import { useDocumentFilter } from "./hooks/useDocumentFilter";
import Hero from "../layout/hero/Hero";
import DocumentToolbar from "./DocumentToolbar";
import { documents } from "./services";
import DocumentGrid from "./DocumentGrid";
import RequirementsSection from "./DocumentRequirements";
import { requirements } from "./requirements";




const DocumentSection = () => {
  const {
    categories,
    activeCategory,
    setActiveCategory,
    query,
    setQuery,
    filtered,
    counts,
    reset,
  } = useDocumentFilter(documents);

  return (
    <>
      <Hero
        minHeight="50vh"
        eyebrow="Documents"
        title="Request barangay documents online"
        description="Certificates, clearances, and registrations, processed faster and without the long lines."
        actions={
          <>
            <Link
              href="/request"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#0F172A] transition-all duration-200 hover:bg-slate-100 active:scale-[0.98]"
            >
              Request a Document
            </Link>
            <Link
              href="#documents"
              className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10 active:scale-[0.98]"
            >
              Browse Documents
            </Link>
          </>
        }
      />

      <section id="documents" className="scroll-mt-16 bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <DocumentToolbar
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            counts={counts}
            query={query}
            onQueryChange={setQuery}
            resultCount={filtered.length}
            totalCount={documents.length}
          />
          <DocumentGrid
            documents={filtered}
            gridKey={`${activeCategory}-${query}`}
            onReset={reset}
          />
        </div>
      </section>

      <RequirementsSection requirements={requirements} />
    </>
  );
};

export default DocumentSection;