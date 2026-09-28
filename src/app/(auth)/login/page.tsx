import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-brand-500 uppercase">
          Welcome back
        </p>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
          Log in
        </h1>
        <p className="text-sm text-neutral-600">
          Sign in to your Canada Green account.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
