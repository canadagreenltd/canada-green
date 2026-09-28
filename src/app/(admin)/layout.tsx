import type { Metadata } from "next";
import { AdminMobileNav, AdminNav } from "@/components/admin/admin-nav";
import { LogoutButton } from "@/components/auth/logout-button";
import { Logo } from "@/components/shared/logo";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-nature-canvas">
      <header className="sticky top-0 z-40 border-b border-brand-300/20 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Logo href="/admin" className="text-base sm:text-lg" />
            <span className="rounded-full bg-brand-700 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase sm:text-xs">
              Admin
            </span>
          </div>
          <LogoutButton />
        </div>
      </header>

      <AdminMobileNav />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-6 sm:py-6 lg:flex-row lg:gap-8">
        <aside className="hidden w-56 shrink-0 lg:block xl:w-60">
          <div className="surface-sidebar sticky top-24">
            <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-brand-500 uppercase">
              Control panel
            </p>
            <AdminNav />
          </div>
        </aside>
        <main className="min-w-0 flex-1 pb-8">{children}</main>
      </div>
    </div>
  );
}
