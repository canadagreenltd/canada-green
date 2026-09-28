import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your Canada Green account password.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-brand-500 uppercase">
          Account recovery
        </p>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
          Forgot password
        </h1>
        <p className="text-sm text-neutral-600">
          Enter your email and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      <ForgotPasswordForm />

      <p className="text-center text-xs text-neutral-600">
        <Link
          href="/"
          className="underline-offset-4 hover:text-brand-700 hover:underline"
        >
          Back to home
        </Link>
      </p>
    </div>
  );
}
