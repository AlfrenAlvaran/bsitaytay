import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/AuthShell";
import AuthForm from "@/features/auth/components/AuthForm";
import Loading from "@/components/Loading";

export const metadata: Metadata = { title: "Login" };

async function LoginForm({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <AuthForm type="login" next={next} />;
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  return (
    <AuthShell
      formNumber="FORM NO. LGU-01-A"
      eyebrow="Welcome Back"
      title="Login"
      subtitle="Login to continue where left off"
      footer={
        <>
          No account yet?{" "}
          <Link
            href="/register"
            className="text-[#B8860B] font-semibold hover:underline"
          >
            Register here
          </Link>
        </>
      }
    >
      <Suspense fallback={<Loading />}>
        <LoginForm searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  );
}