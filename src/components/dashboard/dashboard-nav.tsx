"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, Users, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "My Account", icon: UserRound },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/billing", label: "Billing & Help", icon: CreditCard },
];

export function DashboardNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      {links.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              active
                ? "bg-gradient-to-r from-brand-700 to-brand-500 text-white shadow-md shadow-brand-700/20"
                : "text-neutral-600 hover:bg-moss-100 hover:text-brand-900"
            )}
          >
            <Icon
              className={cn(
                "size-4 shrink-0",
                active ? "text-brand-300" : "text-brand-500 group-hover:text-brand-700"
              )}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-[57px] z-30 flex gap-1.5 overflow-x-auto border-b border-brand-300/20 bg-white/90 px-3 py-2.5 backdrop-blur-md sm:top-[65px] sm:px-6 lg:hidden">
      {links.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors",
              active
                ? "bg-brand-700 text-white shadow-sm"
                : "bg-moss-100 text-brand-700 hover:bg-moss-200"
            )}
          >
            <Icon className="size-3.5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
