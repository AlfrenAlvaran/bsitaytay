import Loading from "@/components/Loading";
import AuthForm from "@/features/auth/components/AuthForm";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { Metadata } from "next";
import Link from "next/link";
import React, { Suspense } from "react";

export const metadata: Metadata = { title: "Register" };

const page = () => {
  return (
    <AuthShell
      formNumber="FORM NO. LGU-01-A"
      eyebrow="Create Account"
      title="Register as a resident"
      subtitle="Register to gets you access to every barangay San Isidro Services"
      footer={
        <>
          Already have account?{" "}
          <Link
            href={"/login"}
            className="text-[#B8860B] font-semibold hover:underline"
          >
            Login here
          </Link>
        </>
      }
    >
      <Suspense fallback={<Loading />}>
        <AuthForm type="register"></AuthForm>
      </Suspense>
    </AuthShell>
  );
};

export default page;
