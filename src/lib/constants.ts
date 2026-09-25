export const SECTORS = {
  EV: "ev",
  AGRICULTURE: "agriculture",
} as const;

export type Sector = (typeof SECTORS)[keyof typeof SECTORS];

export const SECTOR_LABELS: Record<Sector, string> = {
  ev: "EV Charging",
  agriculture: "Agriculture",
};

export const PAYMENT_STATUSES = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUSES)[keyof typeof PAYMENT_STATUSES];

export const ROLES = {
  USER: "user",
  ADMIN: "admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
