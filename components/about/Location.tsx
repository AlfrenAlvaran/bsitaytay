import Reveal from "@/components/ui/Reveal";
import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import { contact } from "./about";

const query = `Barangay San Isidro Hall, ${contact.address}`;
const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;

const details = [
  { icon: MapPin, label: "Address", value: contact.address },
  { icon: Clock, label: "Office hours", value: contact.hours },
  { icon: Phone, label: "Hotline", value: contact.hotline },
];

const Location = () => {
  return (
    <section className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <Reveal className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-[#B8860B]" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
              Find us
            </p>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Visit the barangay hall
          </h2>
        </Reveal>

        <Reveal>
          <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white lg:grid-cols-5">
            <div className="flex flex-col justify-between gap-8 p-6 sm:p-8 lg:col-span-2">
              <ul className="space-y-6">
                {details.map(({ icon: Icon, label, value }) => (
                  <li key={label} className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        {label}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-700">
                        {value}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0F172A] px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#B8860B]"
              >
                Get directions
                <ArrowUpRight
                  className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </a>
            </div>

            <div className="min-h-[320px] border-t border-slate-200 lg:col-span-3 lg:min-h-[440px] lg:border-l lg:border-t-0">
              <iframe
                title="Map of Barangay San Isidro Hall"
                src={embedUrl}
                className="h-full w-full"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Location;