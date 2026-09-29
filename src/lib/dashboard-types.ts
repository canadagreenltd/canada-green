export type PlanStatus = "inactive" | "pending" | "active" | "declined";
export type UserStatus = "active" | "inactive" | "pending";

export type TeamNode = {
  id: string;
  name: string;
  /** Depth from the logged-in user: 0 = self, 1 = direct, 2+ = indirect */
  depth: number;
  children: TeamNode[];
};

export type AuditDateFilter =
  | "today"
  | "yesterday"
  | "this_week"
  | "this_month"
  | "this_year"
  | "all";

export function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function filterByDateRange<T extends { createdAt: string }>(
  rows: T[],
  filter: AuditDateFilter
): T[] {
  if (filter === "all") return rows;

  const now = new Date();
  const todayStart = startOfDay(now);

  let from: Date;
  let to: Date = new Date(now.getTime() + 1);

  switch (filter) {
    case "today":
      from = todayStart;
      break;
    case "yesterday": {
      from = new Date(todayStart);
      from.setDate(from.getDate() - 1);
      to = todayStart;
      break;
    }
    case "this_week": {
      from = new Date(todayStart);
      const day = from.getDay();
      const diff = day === 0 ? 6 : day - 1;
      from.setDate(from.getDate() - diff);
      break;
    }
    case "this_month":
      from = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "this_year":
      from = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      return rows;
  }

  return rows.filter((row) => {
    const t = new Date(row.createdAt).getTime();
    return t >= from.getTime() && t < to.getTime();
  });
}
