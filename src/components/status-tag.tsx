import {
  CASE_STATUS_META,
  CASE_STATUSES,
  statusOf,
  type CaseStatus,
} from "@/lib/case-status";
import type { DeskKey } from "@/lib/desk-catalog";
import { cn } from "@/lib/utils";

type StatusTagProps = {
  status?: CaseStatus;
  id?: string;
  desk?: DeskKey;
  className?: string;
};

export function StatusTag({ status, id, desk, className }: StatusTagProps) {
  const value = status ?? (id ? statusOf(id, desk) : null);
  if (!value) return null;
  const meta = CASE_STATUS_META[value];
  return (
    <span className={cn("status-tag", `status-tag-${value}`, className)} title={meta.hint}>
      {meta.label}
    </span>
  );
}

type StatusFilterProps = {
  value: CaseStatus | "all";
  onChange: (next: CaseStatus | "all") => void;
  className?: string;
};

export function StatusFilter({ value, onChange, className }: StatusFilterProps) {
  return (
    <div className={cn("status-filter", className)} role="group" aria-label="Case status">
      <button
        type="button"
        className={cn("status-filter-btn", value === "all" && "is-active")}
        aria-pressed={value === "all"}
        onClick={() => onChange("all")}
      >
        ALL
      </button>
      {CASE_STATUSES.map((status) => (
        <button
          type="button"
          key={status}
          className={cn(
            "status-filter-btn",
            `status-filter-${status}`,
            value === status && "is-active",
          )}
          aria-pressed={value === status}
          title={CASE_STATUS_META[status].hint}
          onClick={() => onChange(status)}
        >
          {CASE_STATUS_META[status].label}
        </button>
      ))}
    </div>
  );
}
