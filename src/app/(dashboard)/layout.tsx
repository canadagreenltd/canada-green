import type { Metadata } from "next";
import {
  DashboardMobileNav,
  DashboardNav,
} from "@/components/dashboard/dashboard-nav";
import { LogoutButton } from "@/components/auth/logout-button";
import { Logo } from "@/components/shared/logo";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-nature-canvas">
      <header className="sticky top-0 z-40 border-b border-brand-300/20 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <Logo href="/dashboard" className="text-base sm:text-lg" />
            <p className="mt-0.5 hidden text-xs text-brand-500 sm:block">
              Investor dashboard
            </p>
          </div>
          <LogoutButton />
        </div>
      </header>

      <DashboardMobileNav />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-6 sm:py-6 lg:flex-row lg:gap-8">
        <aside className="hidden w-56 shrink-0 lg:block xl:w-60">
          <div className="surface-sidebar sticky top-24">
            <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-brand-500 uppercase">
              Menu
            </p>
            <DashboardNav />
          </div>
        </aside>
        <main className="min-w-0 flex-1 pb-8">{children}</main>
      </div>
    </div>
  );
}
