
import Reveal from "@/components/ui/Reveal";
import CategoryTabs from "./CategoryTabs";
import SearchField from "./SearchField";


type Props = {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  counts: Record<string, number>;
  query: string;
  onQueryChange: (query: string) => void;
  resultCount: number;
  totalCount: number;
};

const DocumentToolbar = ({
  categories,
  activeCategory,
  onSelectCategory,
  counts,
  query,
  onQueryChange,
  resultCount,
  totalCount,
}: Props) => (
  <Reveal className="mb-10">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-[#B8860B]" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
            Available documents
          </p>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          All documents
        </h2>
      </div>
      <span className="text-sm text-slate-500">
        {resultCount} of {totalCount} documents
      </span>
    </div>

    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <CategoryTabs
        categories={categories}
        active={activeCategory}
        counts={counts}
        onSelect={onSelectCategory}
      />
      <SearchField value={query} onChange={onQueryChange} />
    </div>
  </Reveal>
);

export default DocumentToolbar;
