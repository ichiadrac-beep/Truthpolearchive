import { cn } from "@/lib/utils";

type AlienLogoProps = {
  className?: string;
  title?: string;
};

export function AlienLogo({ className, title = "TRUTHPOLE" }: AlienLogoProps) {
  return (
    <img
      src="/logo-alien.webp"
      alt={title}
      title={title}
      width={320}
      height={320}
      decoding="async"
      fetchPriority="high"
      draggable={false}
      className={cn("alien-mark pointer-events-none select-none object-contain", className)}
    />
  );
}
