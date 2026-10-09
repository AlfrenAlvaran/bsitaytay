type Props = {
  categories: string[];
  active: string;
  counts: Record<string, number>;
  onSelect: (category: string) => void;
};

const CategoryTabs = ({ categories, active, counts, onSelect }: Props) => (
  <div className="flex flex-wrap gap-2">
    {categories.map((category) => {
      const isActive = active === category;
      return (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          aria-pressed={isActive}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
            isActive
              ? "bg-[#0F172A] text-white shadow-sm"
              : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          {category}
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
              isActive ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500"
            }`}
          >
            {counts[category] ?? 0}
          </span>
        </button>
      );
    })}
  </div>
);

export default CategoryTabs;