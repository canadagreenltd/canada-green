import { DAILY_PROFIT_RATE, PROFIT_TIMEZONE } from "@/lib/constants";

export type ActivePlanForProfit = {
  amount: number;
  startsAt: string | null;
  endsAt: string | null;
};

/** Calendar YYYY-MM-DD in the profit timezone. */
export function toZonedYmd(
  date: Date,
  timeZone: string = PROFIT_TIMEZONE
): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function parseYmd(ymd: string): { y: number; m: number; d: number } {
  const [y, m, d] = ymd.split("-").map(Number);
  return { y, m, d };
}

function ymdToUtcDate(ymd: string): Date {
  const { y, m, d } = parseYmd(ymd);
  return new Date(Date.UTC(y, m - 1, d));
}

function addDaysYmd(ymd: string, days: number): string {
  const dt = ymdToUtcDate(ymd);
  dt.setUTCDate(dt.getUTCDate() + days);
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const d = String(dt.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** 0 = Sunday … 6 = Saturday (UTC civil date of YMD). */
function weekdayOfYmd(ymd: string): number {
  return ymdToUtcDate(ymd).getUTCDay();
}

/** Monday–Friday earn profit; Saturday/Sunday do not. */
export function isProfitDayYmd(ymd: string): boolean {
  const day = weekdayOfYmd(ymd);
  return day >= 1 && day <= 5;
}

export function isProfitDay(
  date: Date,
  timeZone: string = PROFIT_TIMEZONE
): boolean {
  return isProfitDayYmd(toZonedYmd(date, timeZone));
}

export function dailyProfitForAmount(amount: number): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return amount * DAILY_PROFIT_RATE;
}

/** Inclusive weekday count between two YYYY-MM-DD dates. */
export function countProfitDays(fromYmd: string, toYmd: string): number {
  if (toYmd < fromYmd) return 0;
  let count = 0;
  let cursor = fromYmd;
  while (cursor <= toYmd) {
    if (isProfitDayYmd(cursor)) count += 1;
    cursor = addDaysYmd(cursor, 1);
  }
  return count;
}

function planWindow(
  plan: ActivePlanForProfit,
  now: Date,
  timeZone: string
): { startYmd: string; endYmd: string; todayYmd: string } | null {
  if (!plan.startsAt || !Number.isFinite(plan.amount) || plan.amount <= 0) {
    return null;
  }

  const startYmd = toZonedYmd(new Date(plan.startsAt), timeZone);
  const todayYmd = toZonedYmd(now, timeZone);
  const endsYmd = plan.endsAt
    ? toZonedYmd(new Date(plan.endsAt), timeZone)
    : todayYmd;

  const endYmd = todayYmd < endsYmd ? todayYmd : endsYmd;
  if (endYmd < startYmd) return null;

  return { startYmd, endYmd, todayYmd };
}

/**
 * Today's profit across active plans (0 on weekends / outside plan window).
 */
export function todaysProfit(
  plans: ActivePlanForProfit[],
  now: Date = new Date(),
  timeZone: string = PROFIT_TIMEZONE
): number {
  const todayYmd = toZonedYmd(now, timeZone);
  if (!isProfitDayYmd(todayYmd)) return 0;

  let total = 0;
  for (const plan of plans) {
    const window = planWindow(plan, now, timeZone);
    if (!window) continue;
    // window.endYmd is min(today, plan end) — today must fall inside the plan
    if (todayYmd < window.startYmd || todayYmd > window.endYmd) continue;
    total += dailyProfitForAmount(plan.amount);
  }
  return total;
}

/**
 * All-time accrued profit for active plans (weekday days × 0.5% × principal).
 */
export function totalProfit(
  plans: ActivePlanForProfit[],
  now: Date = new Date(),
  timeZone: string = PROFIT_TIMEZONE
): number {
  let total = 0;
  for (const plan of plans) {
    const window = planWindow(plan, now, timeZone);
    if (!window) continue;
    const days = countProfitDays(window.startYmd, window.endYmd);
    total += days * dailyProfitForAmount(plan.amount);
  }
  return total;
}
