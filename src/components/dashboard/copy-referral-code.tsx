"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyReferralCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/signup?ref=${code}`
      : `/signup?ref=${code}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <code className="max-w-full truncate rounded-xl border border-brand-300/30 bg-gradient-to-r from-moss-100 to-brand-50 px-3 py-2.5 font-mono text-sm font-semibold tracking-wide text-brand-900">
        {code}
      </code>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="border-brand-300/40 hover:bg-moss-100"
      >
        {copied ? "Link copied" : "Copy invite link"}
      </Button>
    </div>
  );
}
