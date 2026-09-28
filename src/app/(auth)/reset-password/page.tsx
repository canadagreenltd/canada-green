import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new password for your Canada Green account.",
};

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-brand-500 uppercase">
          Secure your account
        </p>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
          Reset password
        </h1>
        <p className="text-sm text-neutral-600">
          Choose a new password for your account.
        </p>
      </div>

      <Suspense
        fallback={
          <p className="text-center text-sm text-neutral-600">Loading…</p>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
