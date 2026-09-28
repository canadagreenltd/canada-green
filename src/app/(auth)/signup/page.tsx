import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-brand-500 uppercase">
          Join Canada Green
        </p>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
          Create account
        </h1>
        <p className="text-sm text-neutral-600">
          Join Canada Green to explore investment projects.
        </p>
      </div>
      <SignupForm />
    </div>
  );
}
