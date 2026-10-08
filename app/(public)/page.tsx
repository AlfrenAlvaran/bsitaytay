import ServiceSection from "@/components/documents/ServiceSection";
import Instruction from "@/components/instruction/InstructionSection";
import HomeHero from "@/components/layout/Home/HomeHero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Barangay San Isidro",
};

const HomePage = () => {
  return (
    <>
      <HomeHero />
      <ServiceSection />
      <Instruction />
    </>
  );
};

export default HomePage;
