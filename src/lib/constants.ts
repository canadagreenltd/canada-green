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
  ACTIVE: "active",
  DECLINED: "declined",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUSES)[keyof typeof PAYMENT_STATUSES];

/** Minimum investment amount (whole numbers only) */
export const MIN_INVESTMENT_CAD = 100;

/** Plan tenure after admin approval */
export const PLAN_TENURE_MONTHS = 18;

/** Show renew banner this many days before ends_at */
export const PLAN_RENEWAL_NOTICE_DAYS = 10;

/** Daily profit rate on weekdays (Mon–Fri): 0.5% of principal */
export const DAILY_PROFIT_RATE = 0.005;

/** Timezone used to decide weekday vs weekend for profit */
export const PROFIT_TIMEZONE = "America/Toronto";

/** Referral commission: direct (L1) rate of approved investment */
export const REFERRAL_DIRECT_RATE = 0.05;

/** Referral commission: indirect (L2+) rate of approved investment */
export const REFERRAL_INDIRECT_RATE = 0.01;

/** Max commission depth without unlock */
export const REFERRAL_DEFAULT_MAX_DEPTH = 5;

/** Max commission depth when unlocked */
export const REFERRAL_UNLOCKED_MAX_DEPTH = 10;

/** Direct referrals required to unlock depth 10 */
export const REFERRAL_DIRECTS_TO_UNLOCK = 5;

/** Live payment destinations shown on Billing */
export const PAYMENT_INSTRUCTIONS = {
  usdt: {
    label: "USDT wallet (BEP-20)",
    network: "BEP-20",
    address: "0x0f34cd26cd14fcc0b1882f14f0538e94235af023",
  },
  bank: {
    label: "Local bank account (Pakistan)",
    bankName: "Meezan Bank Limited",
    iban: "PK42MEZN0001780109948488",
  },
  referenceNote:
    "After transferring, submit the exact amount and a receipt screenshot below.",
} as const;

export const ROLES = {
  USER: "user",
  ADMIN: "admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
