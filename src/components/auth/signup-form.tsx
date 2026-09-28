"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { createClient } from "@/lib/supabase/client";
import { getSiteUrl, isSupabaseConfigured } from "@/lib/supabase/env";
import { cn } from "@/lib/utils";
import { signupSchema, type SignupValues } from "@/lib/validations/auth";

function SignupFormInner() {
  const searchParams = useSearchParams();
  const refFromUrl = searchParams.get("ref")?.trim().toUpperCase() ?? "";
  const [checkEmail, setCheckEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      referralCode: refFromUrl,
    },
  });

  const onSubmit = async (values: SignupValues) => {
    if (!isSupabaseConfigured()) {
      toast.error("Supabase is not configured");
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/dashboard`,
          data: {
            full_name: values.fullName,
            referral_code: values.referralCode.trim().toUpperCase(),
          },
        },
      });

      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes("referral") || msg.includes("invalid referral")) {
          toast.error("Invalid referral code", {
            description: "Ask your referrer for their code and try again.",
          });
          return;
        }
        toast.error(error.message);
        return;
      }

      // Supabase returns a user with empty identities when email already exists
      if (data.user && (data.user.identities?.length ?? 0) === 0) {
        toast.error("An account with this email may already exist", {
          description: "Try logging in or use Forgot password.",
        });
        return;
      }

      // Confirm email ON → no session until they click the link
      if (!data.session) {
        setCheckEmail(values.email);
        toast.success("Check your email", {
          description:
            "We sent a confirmation link. Confirm your email, then log in.",
        });
        return;
      }

      // Confirm email OFF (dev) — session returned immediately
      toast.success("Account created");
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Signup failed");
    }
  };

  if (checkEmail) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm leading-relaxed text-neutral-600">
          We sent a confirmation link to{" "}
          <strong className="text-brand-900">{checkEmail}</strong>. Open it to
          activate your account, then log in.
        </p>
        <p className="text-xs text-neutral-500">
          Check spam if you do not see it within a few minutes.
        </p>
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "secondary", size: "lg" }),
            "w-full"
          )}
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FieldGroup>
        <Field data-invalid={!!errors.fullName || undefined}>
          <FieldLabel htmlFor="fullName">Full name</FieldLabel>
          <Input
            id="fullName"
            autoComplete="name"
            placeholder="Your full name"
            aria-invalid={!!errors.fullName}
            {...register("fullName")}
          />
          {errors.fullName && (
            <FieldError>{errors.fullName.message}</FieldError>
          )}
        </Field>

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
            autoComplete="new-password"
            placeholder="At least 8 characters"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <FieldError>{errors.password.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!errors.confirmPassword || undefined}>
          <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <FieldError>{errors.confirmPassword.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!errors.referralCode || undefined}>
          <FieldLabel htmlFor="referralCode">Referral code</FieldLabel>
          <Input
            id="referralCode"
            placeholder="Enter referral code"
            aria-invalid={!!errors.referralCode}
            {...register("referralCode")}
          />
          {errors.referralCode && (
            <FieldError>{errors.referralCode.message}</FieldError>
          )}
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        variant="secondary"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-sm text-neutral-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-brand-700 underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}

export function SignupForm() {
  return (
    <Suspense
      fallback={
        <p className="text-center text-sm text-neutral-600">Loading…</p>
      }
    >
      <SignupFormInner />
    </Suspense>
  );
}
