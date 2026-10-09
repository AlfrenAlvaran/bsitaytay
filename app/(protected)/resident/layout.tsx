import type { Metadata } from "next";
import { ResidentShell } from "@/features/residents/components/ResidentShell";

export const metadata: Metadata = {
  title: "Resident Portal · Barangay San Isidro",
};

export default function ResidentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ResidentShell>{children}</ResidentShell>;
}