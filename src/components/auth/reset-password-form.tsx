"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
import { PasswordInput } from "@/components/ui/password-input";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { cn } from "@/lib/utils";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/lib/validations/auth";

type SessionState = "loading" | "ready" | "invalid";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const linkError = searchParams.get("error");

  const [sessionState, setSessionState] = useState<SessionState>(
    linkError === "invalid_link" ? "invalid" : "loading"
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (linkError === "invalid_link") {
      setSessionState("invalid");
      return;
    }

    if (!isSupabaseConfigured()) {
      setSessionState("invalid");
      return;
    }

    let cancelled = false;

    async function checkSession() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();

        if (cancelled) return;

        if (error || !data.user) {
          setSessionState("invalid");
          return;
        }

        setSessionState("ready");
      } catch {
        if (!cancelled) setSessionState("invalid");
      }
    }

    void checkSession();

    return () => {
      cancelled = true;
    };
  }, [linkError]);

  const onSubmit = async (values: ResetPasswordValues) => {
    if (!isSupabaseConfigured()) {
      toast.error("Supabase is not configured", {
        description:
          "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
      });
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        toast.error("Could not update password", {
          description: error.message,
        });
        return;
      }

      toast.success("Password updated", {
        description: "You can now log in with your new password.",
      });
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong", {
        description:
          err instanceof Error ? err.message : "Please try again later.",
      });
    }
  };

  if (sessionState === "loading") {
    return (
      <p className="text-center text-sm text-neutral-600">
        Verifying your reset link…
      </p>
    );
  }

  if (sessionState === "invalid") {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm leading-relaxed text-neutral-600">
          This reset link is invalid or has expired. Request a new one to
          continue.
        </p>
        <Link
          href="/forgot-password"
          className={cn(
            buttonVariants({ variant: "secondary", size: "lg" }),
            "w-full"
          )}
        >
          Request a new link
        </Link>
        <p className="text-sm text-neutral-600">
          <Link
            href="/login"
            className="font-semibold text-brand-700 underline-offset-4 hover:underline"
          >
            Back to login
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FieldGroup>
        <Field data-invalid={!!errors.password || undefined}>
          <FieldLabel htmlFor="password">New password</FieldLabel>
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
      </FieldGroup>

      <Button
        type="submit"
        variant="secondary"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
