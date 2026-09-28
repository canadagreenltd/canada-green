"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  filterByDateRange,
  type AuditDateFilter,
} from "@/lib/dashboard-types";
import { formatAdminDate } from "@/lib/format-money";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

const dateFilters: Array<{ id: AuditDateFilter; label: string }> = [
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "this_week", label: "This week" },
  { id: "this_month", label: "This month" },
  { id: "this_year", label: "This year" },
  { id: "all", label: "All time" },
];

export type AuditLogRow = {
  id: string;
  userName: string;
  action: string;
  detail: string;
  createdAt: string;
};

export function AuditLogsPanel({
  initialLogs,
}: {
  initialLogs: AuditLogRow[];
}) {
  const [filter, setFilter] = useState<AuditDateFilter>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => filterByDateRange(initialLogs, filter),
    [filter, initialLogs]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const slice = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const setDateFilter = (next: AuditDateFilter) => {
    setFilter(next);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-brand-500 uppercase">
          Activity
        </p>
        <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
          Audit logs
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          User and admin activity from the database. Filter by date and page
          through results.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {dateFilters.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setDateFilter(id)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
              filter === id
                ? "bg-brand-700 text-white shadow-sm"
                : "bg-moss-100 text-brand-700 ring-1 ring-brand-300/30 hover:bg-moss-200"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="surface-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slice.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-neutral-600"
                >
                  No activity in this filter.
                </TableCell>
              </TableRow>
            ) : (
              slice.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap text-neutral-600">
                    {formatAdminDate(log.createdAt)}
                  </TableCell>
                  <TableCell className="font-medium text-brand-900">
                    {log.userName}
                  </TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell className="max-w-[280px] truncate text-neutral-600">
                    {log.detail}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between gap-3 text-sm">
          <p className="text-neutral-600">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
