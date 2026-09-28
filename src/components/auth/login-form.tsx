"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { ROLES, type Role } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { ensureClientProfile } from "@/lib/supabase/ensure-profile";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { loginSchema, type LoginValues } from "@/lib/validations/auth";

function safeInternalPath(next: string | null): string | null {
  if (!next) return null;
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return null;
  }
  if (
    next === "/dashboard" ||
    next === "/admin" ||
    next.startsWith("/dashboard/") ||
    next.startsWith("/admin/")
  ) {
    return next;
  }
  return null;
}

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = safeInternalPath(searchParams.get("next"));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    if (!isSupabaseConfigured()) {
      toast.error("Supabase is not configured");
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      const userId = data.user?.id;
      let role: Role = ROLES.USER;

      if (userId) {
        const profile = await ensureClientProfile();
        if (profile?.role === ROLES.ADMIN) {
          role = ROLES.ADMIN;
        }
      }

      const fallback = role === ROLES.ADMIN ? "/admin" : "/dashboard";
      // Honor ?next= only if it matches the user's role area
      let destination = fallback;
      if (nextPath) {
        if (role === ROLES.ADMIN) {
          destination = nextPath;
        } else if (
          nextPath === "/dashboard" ||
          nextPath.startsWith("/dashboard/")
        ) {
          destination = nextPath;
        }
      }

      router.push(destination);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FieldGroup>
        <Field data-invalid={!!errors.email || undefined}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.password || undefined}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Your password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <FieldError>{errors.password.message}</FieldError>
          )}
        </Field>
      </FieldGroup>

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        variant="secondary"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing in…" : "Log in"}
      </Button>

      <p className="text-center text-sm text-neutral-600">
        No account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-brand-700 underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}

export function LoginForm() {
  return (
    <Suspense
      fallback={
        <p className="text-center text-sm text-neutral-600">Loading…</p>
      }
    >
      <LoginFormInner />
    </Suspense>
  );
}
