import Location from "@/components/about/Location";
import ContactForm from "@/components/layout/contact/ContactForm";
import ContactInfo from "@/components/layout/contact/ContactInfo";
import Hero from "@/components/layout/hero/Hero";
import Reveal from "@/components/ui/Reveal";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Barangay San Isidro",
  description:
    "Contact Barangay San Isidro, Taytay, Rizal. Office hours, hotlines, and a message form.",
};
const ContactPage = () => {
  return (
    <>
      <Hero
        minHeight="50vh"
        eyebrow="Contact us"
        title="We're here to help"
        description="Send us a message, call a hotline, or visit the barangay hall during office hours."
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 sm:px-8 lg:grid-cols-5 lg:gap-16">
          <Reveal className="lg:col-span-3">
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-[#B8860B]" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
                  Send a message
                </p>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Get in touch
              </h2>
            </div>
            <ContactForm />
          </Reveal>

          <Reveal delay={80} className="lg:col-span-2">
            <ContactInfo />
          </Reveal>
        </div>
      </section>

      <Location />
    </>
  );
};

export default ContactPage;
