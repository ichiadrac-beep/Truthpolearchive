import { cn } from "@/lib/utils";

type AlienLogoProps = {
  className?: string;
  title?: string;
};

export function AlienLogo({ className, title = "TRUTHPOLE" }: AlienLogoProps) {
  return (
    <img
      src="/logo-alien.png"
      alt={title}
      title={title}
      width={512}
      height={512}
      draggable={false}
      className={cn("alien-mark pointer-events-none select-none object-contain", className)}
    />
  );
}
