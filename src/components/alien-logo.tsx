import { useRef } from "react";
import { cn } from "@/lib/utils";

type AlienLogoProps = {
  className?: string;
  title?: string;
  glitchOnTap?: boolean;
};

export function AlienLogo({ className, title = "TRUTHPOLE", glitchOnTap = false }: AlienLogoProps) {
  const ref = useRef<HTMLImageElement>(null);

  const glitch = () => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.classList.remove("alien-mark-glitch");
    void el.offsetWidth;
    el.classList.add("alien-mark-glitch");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.remove("alien-mark-glitch");
      });
    });
  };

  return (
    <img
      ref={ref}
      src="/logo-alien.png"
      alt={title}
      title={title}
      width={512}
      height={512}
      draggable={false}
      onPointerDown={glitchOnTap ? glitch : undefined}
      className={cn(
        "alien-mark select-none object-contain",
        glitchOnTap ? "pointer-events-auto cursor-pointer" : "pointer-events-none",
        className,
      )}
    />
  );
}
