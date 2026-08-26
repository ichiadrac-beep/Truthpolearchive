import { FileText, Heart, MessageCircle } from "lucide-react";
import { MORE_LINKS } from "@/lib/tabs";

const ICONS = {
  file: FileText,
  message: MessageCircle,
  heart: Heart,
};

type MoreSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (href: string) => void;
};

export function MoreSheet({ open, onOpenChange, onSelect }: MoreSheetProps) {
  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close more desks"
        className="absolute inset-0 z-30 bg-black/70"
        onClick={() => onOpenChange(false)}
      />
      <div className="glass-sheet absolute right-3 bottom-[4.65rem] left-3 z-40 overflow-hidden rounded-3xl px-2 py-3">
        <p className="px-4 pb-1 font-display text-[11px] tracking-[0.38em] text-fg/50">MORE DESKS</p>
        {MORE_LINKS.map((link) => {
          const Icon = ICONS[link.icon];
          return (
            <button
              key={link.href}
              type="button"
              onClick={() => {
                onSelect(link.href);
                onOpenChange(false);
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left active:bg-fg/8"
            >
              <Icon className="size-5 text-fg/80" strokeWidth={1.5} />
              <span>
                <span className="block text-[15px] text-fg">{link.label}</span>
                <span className="block text-sm text-fg/50">{link.blurb}</span>
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
