import { type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "chip" | "icon";

type GlassButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  asChild?: boolean;
};

const variants: Record<Variant, string> = {
  primary:
    "glass-strong h-12 w-full rounded-2xl px-5 font-display text-sm font-semibold tracking-wide text-fg",
  ghost:
    "glass h-12 w-full rounded-2xl px-5 font-display text-sm font-semibold tracking-wide text-fg",
  chip: "glass-chip h-11 shrink-0 rounded-full px-4 font-display text-xs font-semibold tracking-wide text-fg",
  icon: "glass grid size-11 place-items-center rounded-full text-fg",
};

export function GlassButton({
  className,
  variant = "primary",
  type = "button",
  asChild = false,
  children,
  ...props
}: GlassButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      {...(!asChild ? { type } : {})}
      className={cn(
        "relative z-20 inline-flex items-center justify-center select-none",
        "pointer-events-auto cursor-pointer",
        "transition-[transform,opacity,box-shadow,background-color] duration-150 ease-out",
        "active:not-disabled:scale-[0.96]",
        "disabled:opacity-50",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
