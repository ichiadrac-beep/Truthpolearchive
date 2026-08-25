import { GlassButton } from "@/components/glass-button";
import { TABS } from "@/lib/tabs";
import { cn } from "@/lib/utils";

type TabStripProps = {
  activeHref?: string;
  onSelect: (href: string) => void;
};

export function TabStrip({ activeHref, onSelect }: TabStripProps) {
  return (
    <nav
      aria-label="Archive sections"
      className="no-scrollbar flex w-full gap-2 overflow-x-auto px-1 py-1"
    >
      {TABS.map((tab) => {
        const active = tab.href === activeHref;
        return (
          <GlassButton
            key={tab.id}
            variant="chip"
            aria-current={active ? "page" : undefined}
            onClick={() => onSelect(tab.href)}
            className={cn(active && "glass-strong text-fg")}
          >
            {tab.label}
          </GlassButton>
        );
      })}
    </nav>
  );
}
