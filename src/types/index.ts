import type { PaymentStatus, Role, Sector } from "@/lib/constants";

export type { PaymentStatus, Role, Sector };

/** Shared app-level types — expand as features are built */
export type ProjectSummary = {
  id: string;
  title: string;
  sector: Sector;
};
