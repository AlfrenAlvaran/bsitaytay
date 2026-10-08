import CTA from "@/components/layout/CTA";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import React from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-16">
      <Navbar />
      {children}
      <CTA />
      <Footer />
    </div>
  );
}
