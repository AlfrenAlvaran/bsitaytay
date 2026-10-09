import React, { Suspense } from "react";
import type { Metadata } from "next";
import Loading from "@/components/Loading";
import DocumentSection from "@/components/documents/DocumentSection";

export const metadata: Metadata = {
  title: "Certificate | Barangay San Isidro",
  description:
    "Learn about Barangay San Isidro, Taytay, Rizal: our mission, vision, values, and officials.",
};

const page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <DocumentSection />
    </Suspense>
  );
};

export default page;
