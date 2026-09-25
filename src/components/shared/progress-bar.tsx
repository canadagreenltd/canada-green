"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { Sector } from "@/lib/constants";

type ProgressBarProps = {
  percent: number;
  sector?: Sector;
  className?: string;
  animate?: boolean;
};

export function ProgressBar({
  percent,
  sector = "ev",
  className,
  animate = true,
}: ProgressBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div
      ref={ref}
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-neutral-200",
        className
      )}
    >
      <motion.div
        className={cn(
          "h-full rounded-full",
          sector === "ev" ? "bg-ev-500" : "bg-agri-500"
        )}
        initial={animate ? { width: 0 } : { width: `${clamped}%` }}
        animate={
          animate
            ? { width: inView ? `${clamped}%` : 0 }
            : { width: `${clamped}%` }
        }
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}
