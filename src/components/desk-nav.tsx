import { Eye, Globe, Landmark, MoreHorizontal, Radio } from "lucide-react";
import { PRIMARY_NAV } from "@/lib/tabs";
import { cn } from "@/lib/utils";

const ICONS = {
  globe: Globe,
  eye: Eye,
  landmark: Landmark,
  radio: Radio,
};

type DeskNavProps = {
  activeHref: string;
  moreOpen: boolean;
  onSelect: (href: string) => void;
  onMore: () => void;
};

export function DeskNav({ activeHref, moreOpen, onSelect, onMore }: DeskNavProps) {
  const moreActive =
    moreOpen ||
    activeHref === "/the-pole" ||
    activeHref === "/support" ||
    activeHref === "/articles";

  return (
    <nav
      aria-label="Desk"
      className="grid grid-cols-5 border-t border-fg/10 bg-black px-1 pt-1 pb-[max(0.35rem,env(safe-area-inset-bottom))]"
    >
      {PRIMARY_NAV.map((tab) => {
        const Icon = ICONS[tab.icon];
        const active = tab.href === activeHref && !moreOpen;
        return (
          <button
            key={tab.href}
            type="button"
            onClick={() => onSelect(tab.href)}
            className="flex min-h-12 flex-col items-center justify-center gap-0.5"
            aria-current={active ? "page" : undefined}
          >
            <span
              className={cn(
                "grid size-9 place-items-center rounded-full",
                active && "glass",
              )}
            >
              <Icon className={cn("size-[18px]", active ? "text-fg" : "text-fg/45")} strokeWidth={1.6} />
            </span>
            <span className={cn("font-sans text-[10px]", active ? "text-fg" : "text-fg/45")}>
              {tab.label}
            </span>
          </button>
        );
      })}
      <button
        type="button"
        onClick={onMore}
        className="flex min-h-12 flex-col items-center justify-center gap-0.5"
        aria-expanded={moreOpen}
        aria-label="More desks"
      >
        <span
          className={cn(
            "grid size-9 place-items-center rounded-full",
            moreActive && "glass",
          )}
        >
          <MoreHorizontal
            className={cn("size-[18px]", moreActive ? "text-fg" : "text-fg/45")}
            strokeWidth={1.6}
          />
        </span>
        <span className={cn("font-sans text-[10px]", moreActive ? "text-fg" : "text-fg/45")}>
          More
        </span>
      </button>
    </nav>
  );
}
