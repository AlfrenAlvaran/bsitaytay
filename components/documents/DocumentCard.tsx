import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { RequestDocumentItem } from "./services";

type Props = RequestDocumentItem;

const DocumentCard = ({
  title,
  description,
  tag,
  fee,
  processing,
  icon: Icon,
}: Props) => {
  return (
    <Link
      href="/request"
      className="group relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8860B]/50"
    >
      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200 transition-all duration-300 group-hover:bg-[#0F172A] group-hover:text-white group-hover:ring-[#0F172A]">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>

        {tag && (
          <span className="rounded-full bg-[#B8860B]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#B8860B]">
            {tag}
          </span>
        )}
      </div>

      <h3 className="mb-2 text-base font-semibold tracking-tight text-slate-900">
        {title}
      </h3>
      <p className="mb-6 text-sm leading-relaxed text-slate-500">
        {description}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="font-semibold text-slate-900">{fee}</span>
          <span className="h-3 w-px bg-slate-200" />
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
            {processing}
          </span>
        </div>

        <ArrowUpRight
          className="h-4 w-4 text-slate-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#B8860B]"
          strokeWidth={2}
        />
      </div>
    </Link>
  );
};

export default DocumentCard;