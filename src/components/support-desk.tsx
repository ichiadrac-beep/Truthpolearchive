import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { GlassButton } from "@/components/glass-button";
import { cn } from "@/lib/utils";

const PAYPAL = "https://paypal.me/Truthpolex497";
const BNB_ADDRESS = "0xe49CD42Dd6B940016Ef22744cA230fA3f2e441Ea";
const AMOUNTS = [1, 3, 5] as const;

export function SupportDesk() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(BNB_ADDRESS);
    } catch {
      const field = document.createElement("textarea");
      field.value = BNB_ADDRESS;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.left = "-9999px";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      document.body.removeChild(field);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="mx-auto flex w-full max-w-lg flex-col gap-4 px-5 pt-2 pb-2">
      <p className="font-display text-[11px] font-medium tracking-[0.38em] text-fg/45">SUPPORT</p>
      <h1 className="font-serif text-[2.35rem] leading-none text-fg">Support</h1>
      <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-fg/75">
        The archive stays open on what people send. Tips only. No subscription.
      </p>

      <div className="glass flex flex-col gap-3 rounded-2xl px-4 py-4">
        <p className="font-display text-xs font-medium tracking-kicker text-muted">PAYPAL</p>
        <p className="text-sm leading-normal text-fg/90">A light amount is enough. Pick one, or send what you want.</p>
        <div className="flex flex-wrap gap-2">
          {AMOUNTS.map((amount) => (
            <a
              key={amount}
              href={`${PAYPAL}/${amount}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "glass-chip inline-flex h-11 min-w-14 items-center justify-center rounded-full px-4",
                "font-display text-sm font-semibold tracking-wide text-fg",
                "transition-[transform,opacity] duration-150 ease-out active:scale-[0.96]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg",
              )}
            >
              ${amount}
            </a>
          ))}
        </div>
        <a
          href={PAYPAL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "glass-strong inline-flex h-12 w-full items-center justify-center rounded-2xl px-5",
            "font-display text-sm font-semibold tracking-wide text-fg",
            "transition-[transform,opacity] duration-150 ease-out active:scale-[0.96]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg",
          )}
        >
          PayPal
        </a>
      </div>

      <div className="glass flex flex-col gap-3 rounded-2xl px-4 py-4">
        <p className="font-display text-xs font-medium tracking-kicker text-muted">BNB SMART CHAIN</p>
        <p className="text-sm leading-normal text-fg/90">BEP-20. Send BNB or a BEP-20 token to this address only.</p>
        <p className="select-all break-all font-display text-sm leading-normal tracking-wide text-fg">{BNB_ADDRESS}</p>
        <GlassButton
          variant="ghost"
          onClick={copy}
          aria-label={copied ? "Address copied" : "Copy address"}
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="size-4" strokeWidth={1.8} />
              Copied
            </>
          ) : (
            <>
              <Copy className="size-4" strokeWidth={1.8} />
              Copy address
            </>
          )}
        </GlassButton>
        <p className="sr-only" aria-live="polite">
          {copied ? "Address copied" : ""}
        </p>
      </div>
    </section>
  );
}
