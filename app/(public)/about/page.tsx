import Location from "@/components/about/Location";
import MissionVision from "@/components/about/MissionVision";
import Values from "@/components/about/Values";
import Hero from "@/components/layout/hero/Hero";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "About | Barangay San Isidro",
  description:
    "Learn about Barangay San Isidro, Taytay, Rizal: our mission, vision, values, and officials.",
};

const AboutPage = () => {
  return (
    <>
      <Hero
        minHeight="60vh"
        eyebrow="About Us"
        title="Barangay San Isidro"
        description="Serving the community of Taytay, Rizal with transparent governance and efficient public service."
      />

      <MissionVision />

      <Values />
      <Location />

    </>
  );
};

export default AboutPage;
