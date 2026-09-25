import Link from "next/link";

export function UtilityBar() {
  return (
    <div className="hidden border-b border-brand-900 bg-brand-950 text-[11px] tracking-wide text-white/80 uppercase md:block">
      <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 lg:px-6">
        <span>🍁 Proudly Canadian</span>
        <div className="flex items-center gap-4">
          {/*
            Language toggle (EN | FR) — disabled pending i18n implementation.
            Re-enable when translations are ready:

            <span className="flex gap-1.5">
              <button type="button" className="font-semibold text-white">EN</button>
              <span className="text-white/40">|</span>
              <button type="button" className="text-white/50 transition hover:text-white">FR</button>
            </span>
          */}
          <Link href="/login" className="transition hover:text-white">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
