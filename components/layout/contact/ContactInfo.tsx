import { Clock, MapPin, Phone } from "lucide-react";
import { contact } from "./contact";
import { FacebookIcon } from "@/components/ui/icons";

const toTel = (value: string) => `tel:${value.replace(/[^\d+]/g, "")}`;

const ContactInfo = () => {
  return (
    <div className="space-y-8">
      <ul className="space-y-6">
        <li className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200">
            <MapPin className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Address
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">
              {contact.address}
            </p>
          </div>
        </li>

        <li className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200">
            <Clock className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Office hours
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">
              {contact.hours}
            </p>
          </div>
        </li>

        <li className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200">
            <FacebookIcon className="h-5 w-5"  />
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Facebook
            </p>
            <a
              href={contact.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm text-slate-700 underline-offset-4 transition-colors hover:text-[#B8860B] hover:underline"
            >
              Barangay San Isidro, Taytay Rizal
            </a>
          </div>
        </li>
      </ul>

      <div>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900">
          Hotlines
        </p>
        <ul className="space-y-3">
          {contact.hotlines.map(({ label, value }) => (
            <li key={label}>
              <a
                href={toTel(value)}
                className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/[0.05]"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200 transition-all duration-300 group-hover:bg-[#0F172A] group-hover:text-white group-hover:ring-[#0F172A]">
                    <Phone className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <span className="text-sm font-medium text-slate-900">
                    {label}
                  </span>
                </div>
                <span className="text-sm text-slate-500">{value}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContactInfo;