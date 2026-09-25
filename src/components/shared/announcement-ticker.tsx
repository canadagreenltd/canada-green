"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const MESSAGE =
  "Want to Invest and Grow in Canada  🇨🇦  Something Big is Coming Soon  🇨🇦  Stay Tuned";

const SEGMENT = (
  <>
    <span>{MESSAGE}</span>
    <span className="mx-6 inline-flex items-center opacity-90" aria-hidden>
      🇨🇦
    </span>
  </>
);

type AnnouncementTickerProps = {
  className?: string;
};

/**
 * Persistent site-wide announcement strip.
 * Seamless CSS marquee; static when prefers-reduced-motion is set.
 */
export function AnnouncementTicker({ className }: AnnouncementTickerProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (reducedMotion) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "flex h-10 items-center justify-center overflow-hidden bg-accent-red px-4",
          className
        )}
      >
        <p className="truncate text-center text-[12px] font-bold tracking-[0.14em] text-white uppercase sm:text-[13px]">
          {MESSAGE}
        </p>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={MESSAGE}
      className={cn(
        "group/ticker flex h-10 items-center overflow-hidden bg-accent-red",
        className
      )}
    >
      <div className="flex w-max animate-announcement-ticker group-hover/ticker:[animation-play-state:paused]">
        {/* Two identical tracks → translateX(-50%) loops seamlessly */}
        <div className="flex shrink-0 items-center whitespace-nowrap text-[12px] font-bold tracking-[0.14em] text-white uppercase sm:text-[13px]">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={`a-${i}`} className="inline-flex items-center">
              {SEGMENT}
            </span>
          ))}
        </div>
        <div
          className="flex shrink-0 items-center whitespace-nowrap text-[12px] font-bold tracking-[0.14em] text-white uppercase sm:text-[13px]"
          aria-hidden
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={`b-${i}`} className="inline-flex items-center">
              {SEGMENT}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
