"use client";

import { useRef } from "react";
import { Search, X } from "lucide-react";
import { useFocusShortcut } from "./hooks/useFocusShortcut";


type Props = {
  value: string;
  onChange: (value: string) => void;
};

const SearchField = ({ value, onChange }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useFocusShortcut(inputRef);

  return (
    <div className="relative sm:w-64">
      <Search
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        strokeWidth={2}
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search documents..."
        className="w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-12 text-sm text-slate-700 placeholder:text-slate-400 transition-all duration-200 focus:border-[#B8860B] focus:outline-none focus:ring-2 focus:ring-[#B8860B]/20"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
      ) : (
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
          /
        </kbd>
      )}
    </div>
  );
};

export default SearchField;