import { SearchX } from "lucide-react";

const EmptyState = ({ onReset }: { onReset: () => void }) => (
  <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
    <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 ring-1 ring-inset ring-slate-200">
      <SearchX className="h-6 w-6" strokeWidth={1.75} />
    </span>
    <h3 className="text-lg font-semibold tracking-tight text-slate-900">
      No documents found
    </h3>
    <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
      Try a different keyword or category.
    </p>
    <button
      type="button"
      onClick={onReset}
      className="mt-6 rounded-lg bg-[#0F172A] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#B8860B]"
    >
      Clear filters
    </button>
  </div>
);

export default EmptyState;