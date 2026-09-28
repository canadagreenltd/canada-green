"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleLogout}
      aria-label="Log out"
      className="gap-1.5 border-brand-300/40 bg-white/70 text-brand-800 hover:bg-moss-100"
    >
      <LogOut className="size-3.5" />
      <span className="hidden sm:inline">Log out</span>
    </Button>
  );
}
