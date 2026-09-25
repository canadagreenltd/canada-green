"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  light?: boolean;
};

export function NavLink({
  href,
  children,
  className,
  onClick,
  light = false,
}: NavLinkProps) {
  const pathname = usePathname();
  const active =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative py-1 text-sm font-medium transition-colors",
        light
          ? active
            ? "text-white"
            : "text-white/80 hover:text-white"
          : active
            ? "text-brand-700"
            : "text-neutral-600 hover:text-brand-700",
        className
      )}
    >
      {children}
      <span
        className={cn(
          "absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full transition-transform duration-300 group-hover:scale-x-100",
          light ? "bg-brand-300" : "bg-brand-700",
          active && "scale-x-100"
        )}
      />
    </Link>
  );
}
