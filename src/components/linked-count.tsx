import { cn } from "@/lib/utils";

type LinkedCountProps = {
  count: number;
  onClick: () => void;
  className?: string;
};

export function LinkedCount({ count, onClick, className }: LinkedCountProps) {
  if (count < 1) return null;
  return (
    <button
      type="button"
      className={cn(
        "relative z-20 inline-flex shrink-0 items-center rounded-full px-2.5 py-1",
        "font-display text-[11px] font-semibold tracking-wide text-fg",
        "underline decoration-fg/40 underline-offset-2",
        "active:bg-fg/10",
        className,
      )}
      aria-label={`${count} linked files — open related`}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      {count} linked
    </button>
  );
}
