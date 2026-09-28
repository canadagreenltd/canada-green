import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh bg-nature-canvas">
      {/* Desktop nature panel */}
      <aside className="relative hidden w-[42%] overflow-hidden xl:w-[46%] lg:flex lg:flex-col lg:justify-between">
        <div className="bg-nature-panel absolute inset-0" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 20%, rgb(116 198 157 / 35%), transparent 45%)",
          }}
        />
        <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white xl:p-14">
          <Logo href="/" variant="light" />
          <div className="max-w-md space-y-4">
            <p className="font-script text-3xl text-brand-300 xl:text-4xl">
              Grow with Canada
            </p>
            <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight xl:text-4xl">
              Invest in a greener tomorrow
            </h1>
            <p className="text-base leading-relaxed text-white/80">
              EV charging and agriculture projects across Canada — transparent,
              community-driven, and built for long-term impact.
            </p>
          </div>
          <p className="text-sm text-white/55">
            Secure access · Canadian projects · Real impact
          </p>
        </div>
      </aside>

      {/* Form column */}
      <div className="relative flex flex-1 flex-col">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgb(116 198 157 / 18%), transparent 40%), radial-gradient(circle at 90% 80%, rgb(45 106 79 / 10%), transparent 35%)",
          }}
        />
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-14">
          <div className="mb-6 sm:mb-8 lg:hidden">
            <Logo href="/" />
          </div>
          <div className="surface-card w-full max-w-md p-5 sm:p-8 md:p-9">
            {children}
          </div>
          <p className="mt-5 text-center text-xs text-neutral-600 sm:mt-6 sm:text-sm">
            Back to{" "}
            <Link
              href="/"
              className="font-semibold text-brand-700 underline-offset-4 hover:underline"
            >
              Canada Green home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
